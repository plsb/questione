import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from "prop-types";

const TinyMCE = props => {
    const { className, history, height, ...rest } = props;

    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
      }

    return (
      <Editor
        apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
        init={{
          height: 200,
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
        name="description"/>

    );

}

TinyMCE.propTypes = {
    className: PropTypes.string,
    tam: PropTypes.number,

};

export default TinyMCE;
