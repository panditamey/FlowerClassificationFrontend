import {
  ChakraProvider,
  Heading,
  Container,
  // Text,
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
    axios.post('https://panditamey-flowerclassificationusingflask.hf.space/upload-image', formData).then((res) => {
      // console.log(res['data']['output'])
      var result = res['data']['output'];
      if (result === undefined || result === null) {
        // console.log(undefined)
      }
      else {
        updateLoading(false);
        updatePridiction(result);
        console.log(prediction)
      }

    })
  }

  return (
    <>
      <ChakraProvider>
        <Container textAlign={"center"}>
          <Heading margin={"20px"}>Flower Classification</Heading>


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
            // <Stack>
            //   <SkeletonCircle />
            //   <SkeletonText />
            // </Stack>
            <Spinner margin={"20px"}
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          ) : prediction ? (
            <>
              <Heading>It is {prediction}!</Heading>
            </>
          ) : null}

          {!loading?
          <Button margin={"20px"} onClick={handleApi} colorScheme={"yellow"}>
            Predict
          </Button>:null}
        </Container>
      </ChakraProvider>
    </>
  );
};

export default App;