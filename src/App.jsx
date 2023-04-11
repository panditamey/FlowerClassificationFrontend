import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack,
  Image,
  Spinner,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [image, updateImage] = useState();
  const [img, updateImg] = useState();
  const [prediction, updatePridiction] = useState();
  const [description, updateDescription] = useState();
  const [loading, updateLoading] = useState();

  var handleImage = (e) => {
    console.log(e.target.files)
    updateImage(e.target.files[0])
    updateImg(URL.createObjectURL(e.target.files[0]));
  }

  var handleApi = () => {
    updateLoading(true);
    const formData = new FormData()
    formData.append('image', image)
    axios.post('http://f1be-34-138-150-45.ngrok.io/upload-image', formData).then((res) => {
      // console.log(res['data']['output'])
      var result = res['data']['output'];
      var des = res['data']['desc'];
      if (result === undefined || result === null) {
        // console.log(undefined)
      }
      else {
        updateLoading(false);
        updatePridiction(result);
        updateDescription(des);
        console.log(prediction)
      }

    })
  }

  return (
    <>
      <ChakraProvider>
        <Container textAlign={"center"}>
          <Heading margin={"20px"}>Plant Disease Prediction</Heading>


          <Wrap marginX={"20px"}>
            <Input
              margin={"20px"}
              type="file"
              name="file"
              // value={prompt}
              onChange={handleImage}
              width={"768px"}
            ></Input>
            {img ? (
              <Image src={`${img}`} boxShadow="lg" />
            ) : null}



          </Wrap>

          {loading ? (
            <>
              <Spinner margin={"20px"}
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
              <Heading as='h4' size='md'>
                wait some time .....
              </Heading>
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />

            </>
          ) : prediction ? (
            <>
              <Heading>Prediction: It looks like {prediction}!</Heading>
              <Text>Description:{description}!</Text>
            </>
          ) : null}

          {!loading ?
            <Button margin={"20px"} onClick={handleApi} colorScheme={"yellow"}>
              Predict
            </Button> : null}
        </Container>
      </ChakraProvider>
    </>
  );
};

export default App;