import React from 'react';

const Status = ({ data, isCompleted, isCurrent, width }) => {
    const suffix = isCompleted ? "-completed" : isCurrent ? "-current" : "";
    return <div className="timeline-item" style={{width: width+"%"}}>
        <div className={"timeline-bar" + suffix}/>
        <div className={"timeline-circle" + suffix}/>
        <div className="timeline-status">{data.status}</div>
    </div>
}

class Timeline extends React.Component {
    render(){
        let { data, current } = this.props;
        let currentIndex = 0, width = 100/data.length;
        data = data.map((val, ind) => {
            let currentObj;
            if(Array.isArray(val)){
                let temp = val.filter(element => element.key === current)[0];
                currentObj = temp ? temp : val[0]
            }else{
                currentObj = val;
            }
            if(currentObj.key === current){
                currentIndex = ind
            }
            return currentObj;
        });
        return <div className="timeline">
            {
                data.map((val, ind) => <Status key={"status_key_"+ind} data = {val} isCompleted={ind < currentIndex} isCurrent={ind === currentIndex} width={width}/>)
            }
        </div>
    }
}

export default Timeline;