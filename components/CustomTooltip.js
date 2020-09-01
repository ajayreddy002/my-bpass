import React from 'react';
import Fade from 'react-reveal/Fade';

const CustomTooltip = (props) => {
  return (
    <div style={props.containerStyle} className="custom-tooltip-wrapper">
      <Fade right collapse when={props.showTooltip}>
        <div className="custom-tooltip-container">
          <span className="title">{props.title}</span>
          <span className="sub-title">{props.subTitle}</span>
          {props.steps && props.steps.length &&
            <ol className="options-container">
              {
                props.steps.map((step, index) => {
                  return (
                    <li key={index}>{step}</li>
                  );
                })
              }
            </ol>
          }
        </div>
      </Fade>
    </div>
  );
}

export default CustomTooltip;
