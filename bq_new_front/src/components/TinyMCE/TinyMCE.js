import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class App extends React.Component {
  handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
  }


  render() {
    return (
      <Editor
        apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
        init={{
          height: 500,
          menubar: false,
          file_picker_types: 'image',
          images_upload_url: 'postAcceptor.php',
          automatic_uploads: false,
          plugins: [
            'textpattern advlist autolink lists link image charmap print',
            ' preview hr anchor pagebreak code media save',
            'table contextmenu FMathEditor charmap'
          ],
          toolbar:
            'insertfile undo redo | fontselect fontsizeselect | bold italic superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview FMathEditor  charmap'
        }}
        name="description"

      

        
      />
      
    );
  }
}

export default App;
