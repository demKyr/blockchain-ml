from flask import Flask, jsonify, request, Response
from flask_cors import CORS, cross_origin

import json

import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer, TFBertForSequenceClassification
from transformers import InputExample, InputFeatures


modelNames = ["BERTModel-Twitter", "BERTModel-IMDB", "BERTModel-Emotions"]
labels = [['Positive','Negative','Neutral'], ['Negative','Positive'], ['Sadness', 'Anger', 'Love', 'Surprise', 'Fear', 'Happiness']]


def loadModel(model_save_name):
    path = F"./NeuralNetwork/{model_save_name}" 
    testSetPath = F"./NeuralNetwork/{model_save_name}-test.csv"
    validationSetPath = F"./NeuralNetwork/{model_save_name}-validation.csv"

    # ## Load the BERT Classifier and Tokenizer along with Input modules
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    # ## Load CSV, test and validation datasets
    test = pd.read_csv(testSetPath)
    validation = pd.read_csv(validationSetPath)
    test = test.iloc[: , 1:]
    validation = validation.iloc[: , 1:]

    loaded_model = TFBertForSequenceClassification.from_pretrained(path, local_files_only=True)

    return loaded_model,tokenizer,test,validation

def convert_data_to_examples_single(inputDataset, DATA_COLUMN, LABEL_COLUMN): 
    train_InputExamples = inputDataset.apply(lambda x: InputExample(guid=None, # Globally unique ID for bookkeeping, unused in this case
                                                        text_a = x[DATA_COLUMN], 
                                                        text_b = None,
                                                        label = x[LABEL_COLUMN]), axis = 1)  
    return train_InputExamples

def convert_examples_to_tf_dataset(examples, tokenizer, max_length=128):
    features = [] # -> will hold InputFeatures to be converted later

    for e in examples:
        # Documentation is really strong for this method, so please take a look at it
        input_dict = tokenizer.encode_plus(
            e.text_a,
            add_special_tokens=True,
            max_length=max_length, # truncates if len(s) > max_length
            return_token_type_ids=True,
            return_attention_mask=True,
            pad_to_max_length=True, # pads to the right by default # CHECK THIS for pad_to_max_length
            truncation=True
        )

        input_ids, token_type_ids, attention_mask = (input_dict["input_ids"],
            input_dict["token_type_ids"], input_dict['attention_mask'])

        features.append(
            InputFeatures(
                input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids, label=e.label
            )
        )

    def gen():
        for f in features:
            yield (
                {
                    "input_ids": f.input_ids,
                    "attention_mask": f.attention_mask,
                    "token_type_ids": f.token_type_ids,
                },
                f.label,
            )

    return tf.data.Dataset.from_generator(
        gen,
        ({"input_ids": tf.int32, "attention_mask": tf.int32, "token_type_ids": tf.int32}, tf.int64),
        (
            {
                "input_ids": tf.TensorShape([None]),
                "attention_mask": tf.TensorShape([None]),
                "token_type_ids": tf.TensorShape([None]),
            },
            tf.TensorShape([]),
        ),
    )

def trainModel(loadedModel,tokenizer,validation,train,model_save_name):

    path = F"./NeuralNetwork/{model_save_name}" 

    DATA_COLUMN = 'DATA_COLUMN'
    LABEL_COLUMN = 'LABEL_COLUMN'

    validation_InputExamples = convert_data_to_examples_single(validation, DATA_COLUMN, LABEL_COLUMN)
    validation_data = convert_examples_to_tf_dataset(list(validation_InputExamples), tokenizer)
    validation_data = validation_data.batch(32)

    train_InputExamples = convert_data_to_examples_single(train, DATA_COLUMN, LABEL_COLUMN)
    train_data = convert_examples_to_tf_dataset(list(train_InputExamples), tokenizer)
    train_data = train_data.batch(32).repeat(2)

    # ## Retrain BERT model
    loadedModel.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5, epsilon=1e-08, clipnorm=1.0), 
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), 
                metrics=[tf.keras.metrics.SparseCategoricalAccuracy('accuracy')])

    loadedModel.fit(train_data, epochs=2, validation_data=validation_data)

    loadedModel.save_pretrained(path)

    return loadedModel

def evaluateModel(loadedModel,tokenizer,test):
    DATA_COLUMN = 'DATA_COLUMN'
    LABEL_COLUMN = 'LABEL_COLUMN'

    test_inputExamples = convert_data_to_examples_single(test, DATA_COLUMN, LABEL_COLUMN)
    test_data = convert_examples_to_tf_dataset(list(test_inputExamples), tokenizer)
    test_data = test_data.batch(32)
    
    loadedModel.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5, epsilon=1e-08, clipnorm=1.0), 
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), 
                metrics=[tf.keras.metrics.SparseCategoricalAccuracy('accuracy')])

    evaluation = loadedModel.evaluate(test_data)

    return (evaluation)

def testModel(loadedModel,tokenizer,pred_sentences,labels):

    tf_batch = tokenizer(pred_sentences, max_length=128, padding=True, truncation=True, return_tensors='tf')
    tf_outputs = loadedModel(tf_batch)
    tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)
    label = tf.argmax(tf_predictions, axis=1)
    label = label.numpy()
    return labels[label[0]]

###################################################################################################################

app = Flask(__name__)


CORS(app)

loadedModel = [None] * len(modelNames)
tokenizer = [None] * len(modelNames)
test = [None] * len(modelNames)
validation = [None] * len(modelNames)

for id,modelName in enumerate(modelNames):
  print(id,modelName)
  loadedModel[id],tokenizer[id],test[id],validation[id] = loadModel(modelName)


@app.route('/train', methods=['POST'])
def trainFun():
    print('Starting Training')
    
    modelId = int(request.args.get('model'))

    # trainSetInput = request.json
    trainSetInput = json.loads(request.data.decode('utf-8'))

    trainDF = pd.DataFrame(trainSetInput)
    del trainDF['id']
    del trainDF['proposedLbl']
    del trainDF['goodData']
    trainDF.columns = ['DATA_COLUMN', 'LABEL_COLUMN']
    trainModel(loadedModel[modelId],tokenizer[modelId],validation[modelId],trainDF,modelNames[modelId])
    
    # response = Response(status=200)
    response = jsonify(status="ok")
    return response


@app.route('/evaluate')
def evaluateFun():
    print('Starting Evaluation')

    modelId = int(request.args.get('model'))

    eval = evaluateModel(loadedModel[modelId],tokenizer[modelId],test[modelId])
    [loss,acc] = eval

    response = jsonify(loss=loss,acc=acc)
    return response


@app.route('/test', methods=['POST'])
def testFun():

    modelId = int(request.args.get('model'))

    dataIn = json.loads(request.data.decode('utf-8'))
    pred_sent = dataIn['caption']

    # pred_sent = request.json['caption']
    pred = testModel(loadedModel[modelId],tokenizer[modelId],pred_sent,labels[modelId])

    response = jsonify(prediction=pred)
    return response




if (__name__ == "__main__"):
    print('Server Running🚀')
    app.run()



