from flask import Flask, request, jsonify ,render_template , redirect
from pydantic import BaseModel
import pickle
import json
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input
import numpy as np
import os
import gdown
import lightgbm as lgb
from PIL import Image
from flask_cors import CORS, cross_origin


app = Flask(__name__)

id = "1dPrnyH7y9ojSHaOOOTkbGkCnhwYvMxab"
output = "disease_new.h5"
gdown.download(id=id, output=output, quiet=False)
   
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

crop_disease_ml=load_model('disease_new.h5')

@app.route("/upload-image", methods=["POST"])
@cross_origin()
def upload_image():
    # if request.method == "POST":
        if request.files:
            imag = request.files["image"]
            try:
                contents = imag.read()
                with open(imag.filename, 'wb') as f:
                    f.write(contents)
            except Exception:
                return {"message": "There was an error uploading the file"}
            finally:
                imag.close()
            print(imag)
            classes = ['Pepper bell  Bacterial spot', 'Pepper bell  healthy', 'Potato  Early blight', 'Potato  Late blight', 'Potato  healthy', 'Tomato Bacterial spot', 'Tomato Early blight', 'Tomato Late blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot', 'Tomato Spider mites Two spotted spider mite', 'Tomato Target Spot', 'Tomato Tomato YellowLeaf Curl Virus', 'Tomato Tomato mosaic virus', 'Tomato healthy']
            img=image.load_img(str(imag.filename),target_size=(224,224))
            x=image.img_to_array(img)
            x=x/255
            img_data=np.expand_dims(x,axis=0)
            prediction = crop_disease_ml.predict(img_data)
            predictions = list(prediction[0])
            max_num = max(predictions)
            index = predictions.index(max_num)
            print(classes[index])
            os.remove(str(imag.filename))
            response = jsonify(output=classes[index])
            # response.headers.add('Access-Control-Allow-Origin', '*')
            # response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            # response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            return response


if __name__ =="__main__":
    app.run(debug=False,host="0.0.0.0",port=5000)