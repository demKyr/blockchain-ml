from flask import Flask, redirect, request, jsonify
from flask_cors import CORS

import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer, TFBertForSequenceClassification
from transformers import InputExample, InputFeatures

def loadModel():
    # ## Load the BERT Classifier and Tokenizer along with Input modules
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    # ## Load CSV, test and validation datasets
    test = pd.read_csv('./NeuralNetwork/test.csv')
    validation = pd.read_csv('./NeuralNetwork/validation.csv')
    test = test.iloc[: , 1:]
    validation = validation.iloc[: , 1:]

    model_save_name = 'BERTModel'
    path = F"./NeuralNetwork/{model_save_name}" 
    loaded_model = TFBertForSequenceClassification.from_pretrained(path, local_files_only=True)
    # loaded_model.summary()

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

def trainModel(loadedModel,tokenizer,validation,train):
    # path = './NeuralNetwork/inputCsv.csv'
    # train = pd.read_csv(path)
    # train['sentiment'] = train['sentiment'].replace('positive', 0)
    # train['sentiment'] = train['sentiment'].replace('negative', 1)
    # train['sentiment'] = train['sentiment'].replace('neutral', 2)
    # train.columns = ['DATA_COLUMN', 'LABEL_COLUMN']
    # train

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

    model_save_name = 'BERTModel'
    path = F"./NeuralNetwork/{model_save_name}" 
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

def testModel(loadedModel,tokenizer,pred_sentences):
    # pred_sentences = ['Today was the best day ever!',
    #                 'Do not talk to me, I am in a bad mood',
    #                 'I do not live in Nicosia',
    #                 'I am very optimistic for this effort']

    tf_batch = tokenizer(pred_sentences, max_length=128, padding=True, truncation=True, return_tensors='tf')
    tf_outputs = loadedModel(tf_batch)
    tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)
    labels = ['Positive','Negative','Neutral']
    label = tf.argmax(tf_predictions, axis=1)
    label = label.numpy()
    # for i in range(len(pred_sentences)):
    #     print(pred_sentences[i], ": \n", labels[label[i]])
    return labels[label[0]]



app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["CORS_HEADERS"]='Content-Type'

loadedModel,tokenizer,test,validation = loadModel()

print('Server Running🚀')

@app.route('/', methods=['POST', 'GET'])
def index():
    if (request.method == 'POST'):
        return "hello"
    else:
        return "world"


@app.route('/train', methods=['POST', 'GET'])
def trainFun():
    # if (request.method == 'POST'):
    print('Starting Training')
    trainSetInput = request.json
    trainDF = pd.DataFrame(trainSetInput)
    trainDF.columns = ['DATA_COLUMN', 'LABEL_COLUMN']
    trainModel(loadedModel,tokenizer,validation,trainDF)
    return 'ok'
# Header:
# 'Content-Type': 'application/json' 
# Body:
#[
#     {"content": "This is a good caption", "verifiedLbl": 0},
#     {"content": "Best day of my life", "verifiedLbl": 0 },
#     {"content": "Worst day of my life", "verifiedLbl": 1}
# ]
    

@app.route('/evaluate')
def evaluateFun():
    print('Starting Evaluation')
    eval = evaluateModel(loadedModel,tokenizer,test)
    [loss,acc] = eval

    response = jsonify(loss=loss,acc=acc)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/test', methods=['POST'])
def testFun():
    print('Starting Testing')
    pred_sent = request.json['caption']
    pred = testModel(loadedModel,tokenizer,pred_sent)

    response = jsonify(prediction=pred)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
# Header:
# 'Content-Type': 'application/json' 
# Body:
# {
#     "caption": ["Today was the worst day ever!"]
# }




if (__name__ == "__main__"):
    app.run(debug=True)



