import React from 'react';
import {Collapse, Checkbox} from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

  const renderCheckBoxList=()=> props.list && props.list.map((value, index)=>(
    <React.Fragment key={index}>
      <Checkbox />
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
