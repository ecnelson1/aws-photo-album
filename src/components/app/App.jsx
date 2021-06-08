import React, {useState} from 'react';
import ImageUploader from 'react-images-upload';
import Axios from 'axios'

const UploadComponent = (props) => (
  <form>
    <label>
      Upload url:
      <input id='urlInput' type='text' onChange={props.onUrlChange} value={props.url}/>
    </label>
    <ImageUploader
      key='image-uploader'
      withIcon={true}
      singleImage={true}
      withPreview={true}
      label ='Max Size: 5MB'
      buttonText= 'choose an image'
      onChange={props.onImage}
      imageExtensions = {['.jpg', '.png', '.jpeg']}
      maxFileSize={5242880}/>
  </form>
)

function App() {
  const [progress, setProgress] = useState('getUpload');
  const[url, setImageUrl] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  const onUrlChange = e => {
    setImageUrl(e.target.value)
  }
  const onImage = async( failedImages, successImages) => {
    if(!url){
      console.log('Missing URL')
      setErrorMessage('missing URL to upload to')
      setProgress('uploadError');
      return;
    }

    setProgress('uploading');
    // console.log('successImages', successImages);

    try {
      console.log('successImages',successImages);
      const parts = successImages[0].split(';')
      const mime = parts[0].split(':')[1];
      const name = parts[1].split('=')[1];
      const data = parts[2];
      const res = await Axios.post(url, { mime, name, image: data })

      setImageUrl(res.data.imageUrl)
      setProgress('uploaded');
    } catch(err) {
      console.log('Error uploading', err);
      setErrorMessage(err.message);
      setProgress('uploadError');
    }
  };

  const content = () => {
    switch(progress){
      case 'getUpload':
          return <UploadComponent onUrlChange={onUrlChange} onImage={onImage} url={url}/>;
      case 'uploading':
          return <h2>UPLOADING...</h2>;
      case 'uploaded':
            return <img src={url} alt='uploaded'/>;
      case 'uploadError':
        return (
          <>
          <div>Error Message ={errorMessage}</div>
          <div>please upload an Image</div>
          </>
        );
    };
  };

  return (
    <div className="App">
      <h1>Greeting Art</h1>
      {content()}
    </div>
  );
};

export default App;
