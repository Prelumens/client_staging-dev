import React from 'react'
import {Button, Space,Divider, Card} from 'antd'
const InteractiveIntro = ({interactive, setStage}) => {
    return (
        <div className='interactive-start text-center'>
            <Space direction='vertical start-header' className='mt-5'>
                <h3 className='start-header'>Welcome to {interactive.title}</h3>
                <h6 style={{color:'#e6f7ff'}}>{interactive.description}</h6>
                <Divider style={{backgroundColor:'#fff', margin:'0px'}}/>
                <div clasname="mt-2">
                    <h6 style={{color:'#e6f7ff'}}>ACTIVITY INSTRUCTIONS:</h6>
                    {interactive.instructions.map((item,index) => {
                        return (<p className='m-0' key={index}>
                            {item}
                        </p>)
                    })}
                </div>
                <h5>Are you ready to play and learn?</h5>
                <Button shape='round' size='large' onClick={()=>setStage('ongoing')}>LET'S GO!</Button>
            </Space>
        </div>
    )
}

export default InteractiveIntro