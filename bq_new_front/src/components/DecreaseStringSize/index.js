import React, { useEffect, useState } from 'react';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import PropTypes from "prop-types";

function DecreaseStringSize(props) {

    const { large, string, width } = props;

    const verifyString = (length) => {
        let tmp = '';
        let number = 1;
        if(large){
            number = large;
        }
        length = length * number;

        if(string.length <= length){
            tmp = string.substring(0,length);
        } else {
            tmp = string.substring(0,length)+'...';
        }
        return tmp;
    };


    if (width == 'xs') {
        return (verifyString(23));
    }
    if (width == 'sm') {
        return (verifyString(28));
    }
    if (width == 'md') {
        return (verifyString(68));
    }
    if (width == 'lg') {
        return (verifyString(75));
    }

    return (string);
}

DecreaseStringSize.propTypes = {
    large: PropTypes.string,
    string: PropTypes.string,
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
};

export default withWidth()(DecreaseStringSize);

//width == 'xs' ? class_student.description.substring(0,20)+'...' :
  //  width == 'sm' ? class_student.description.substring(0,25)+'...' :
    //    width == 'md' ? class_student.description.substring(0,60)+'...' :
      //      width == 'lg' ? class_student.description.substring(0,80)+'...' : null