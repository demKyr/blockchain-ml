# %%
import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer, TFBertForSequenceClassification
from transformers import InputExample, InputFeatures

# %% [markdown]
# ## Load the BERT Classifier and Tokenizer along with Input modules

# %%
# model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=3)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# %% [markdown]
# ## Load CSV, test and validation datasets

# %%
test = pd.read_csv('./test.csv')
validation = pd.read_csv('./validation.csv')
test = test.iloc[: , 1:]
validation = validation.iloc[: , 1:]

# %%
path = './inputCsv.csv'
train = pd.read_csv(path)

# %%
train['sentiment'] = train['sentiment'].replace('positive', 0)
train['sentiment'] = train['sentiment'].replace('negative', 1)
train['sentiment'] = train['sentiment'].replace('neutral', 2)
train.columns = ['DATA_COLUMN', 'LABEL_COLUMN']
train

# %% [markdown]
# ## Create input sequences

# %%
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

    

# %%
DATA_COLUMN = 'DATA_COLUMN'
LABEL_COLUMN = 'LABEL_COLUMN'

# %%
test_inputExamples = convert_data_to_examples_single(test, DATA_COLUMN, LABEL_COLUMN)
test_data = convert_examples_to_tf_dataset(list(test_inputExamples), tokenizer)
test_data = test_data.batch(32)

validation_InputExamples = convert_data_to_examples_single(validation, DATA_COLUMN, LABEL_COLUMN)
validation_data = convert_examples_to_tf_dataset(list(validation_InputExamples), tokenizer)
validation_data = validation_data.batch(32)

# %% [markdown]
# ## Retrain BERT model

# %%
model_save_name = 'BERTModel'
path = F"./{model_save_name}" 

loaded_model = TFBertForSequenceClassification.from_pretrained(path, local_files_only=True)

loaded_model.summary()

# %%
train_InputExamples = convert_data_to_examples_single(train, DATA_COLUMN, LABEL_COLUMN)
train_data = convert_examples_to_tf_dataset(list(train_InputExamples), tokenizer)
train_data = train_data.batch(32).repeat(2)

# %%
loaded_model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5, epsilon=1e-08, clipnorm=1.0), 
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), 
              metrics=[tf.keras.metrics.SparseCategoricalAccuracy('accuracy')])

# %%
# loaded_model.evaluate(test_data)

# %%
loaded_model.fit(train_data, epochs=2, validation_data=validation_data)

# %%
loaded_model.evaluate(test_data)

# %% [markdown]
# ## Save new model

# %%
model_save_name = 'BERTModel'
path = F"./{model_save_name}" 
loaded_model.save_pretrained(path)

# %% [markdown]
# ## Make Predictions with the new Model

# %%
pred_sentences = ['Today was the best day ever!',
                  'Do not talk to me, I am in a bad mood',
                  'I do not live in Nicosia',
                  'I am very optimistic for this effort']

# %%
tf_batch = tokenizer(pred_sentences, max_length=128, padding=True, truncation=True, return_tensors='tf')
tf_outputs = loaded_model(tf_batch)
tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)
labels = ['Positive','Negative','Neutral']
label = tf.argmax(tf_predictions, axis=1)
label = label.numpy()
for i in range(len(pred_sentences)):
  print(pred_sentences[i], ": \n", labels[label[i]])


