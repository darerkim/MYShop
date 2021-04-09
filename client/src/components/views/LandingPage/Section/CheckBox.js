import React,{useState} from 'react';
import {Collapse, Checkbox} from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([])

  const handleToggle=(value)=>{
    //누른것의 인덱스를 구하고 
    const currentIndex = Checked.indexOf(value);
    //전체 채크된 스테이트에서 현재 누른 채크박스가 
    const newChecked = [...Checked];
    if(currentIndex === -1){
      //이미 있다면 더해주고
      newChecked.push(value);
    }else{
      //없다면 빼주고
      newChecked.splice(currentIndex, 1);
    }
    console.log('%cCheckBox.js line:21 newChecked', 'color: #007acc;', newChecked);
    console.log('%cCheckBox.js line:22 Checked', 'color: #007acc;', Checked);
    setChecked(newChecked);
    props.handleFilters(newChecked);
    //State에 넣어준다.
  }
  const renderCheckBoxList=()=> props.list && props.list.map((value, index)=>(
    <React.Fragment key={index}>
      <Checkbox onChange={()=>{handleToggle(value._id)}} checked={Checked.indexOf(value._id)===-1?false:true}/>
        <span>{value.name}</span>
    </React.Fragment>
  ))

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="This is panel header 1" key="1">
          {renderCheckBoxList()}
        </Panel>
      </Collapse>
    </div>
  )
}

export default CheckBox
