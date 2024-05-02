import {
    PageContainer, ProCard, ProForm, ProFormCheckbox,
    ProFormDatePicker, ProFormDateRangePicker, ProFormInstance,
    ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadDragger, StepsForm
} from "@ant-design/pro-components"
import { useRef, useState } from "react";
import TagGroup from "./Database/tagGroup";
import { Card, Modal } from "antd";

const Gen = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return <PageContainer>

        <StepsForm
            onFinish={async (v) => { console.log(v); return showModal() }}
        >

            <StepsForm.StepForm
                name="userInfo"
                title="个人信息"
                stepProps={{
                    description: '输入你个人的相关信息',
                }}
                onFinish={async () => { return true; }}
            >
                <ProFormText
                    name="major"
                    label="专业"
                    width="md"
                    tooltip="专业全称"
                    placeholder="请输入专业全称"
                    rules={[{ required: true }]}
                />
                <ProFormText
                    name="dir"
                    label="研究方向"
                    width="md"
                    tooltip="研究方向"
                    placeholder="请输入研究方向"
                />

                <ProForm.Item
                    name="skills"
                    label="兴趣领域与技能"
                >
                    <TagGroup />
                </ProForm.Item>

                <ProForm.Item
                    name="lessons"
                    label="所修课程"
                    tooltip="建议仅填写与科研相关的非通识基础课程"
                >
                    <TagGroup />
                </ProForm.Item>

                <ProFormTextArea
                    name="remark"
                    label="相关研究经历"
                    width="lg"
                    tooltip="可以是相关的课程论文、学科竞赛等的标题和内容概括"
                    placeholder="请输入相关经历"
                />

            </StepsForm.StepForm>

            <StepsForm.StepForm
                name="projectIdea"
                title="头脑风暴"
                stepProps={{
                    description: '填入关于项目的idea',
                }}
                onFinish={async () => { return true }}
            >

                <ProForm.Item
                    name="keywords"
                    label="你想到的研究关键词"
                >
                    <TagGroup />
                </ProForm.Item>

                <ProFormTextArea
                    name="idea"
                    label="你的一些初步思考"
                    width="lg"
                />

                <ProFormUploadDragger
                    name="ref"
                    label="你参考的文献与资料"
                />
            </StepsForm.StepForm>

            <StepsForm.StepForm
                name="confirm"
                title="信息确认"
                stepProps={{
                    description: '确认信息，立即生成！',
                }}
            >



            </StepsForm.StepForm>

        </StepsForm>

        <Modal title="选题结果" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Card loading={true}>

            </Card>
        </Modal>


    </PageContainer>
}

export default Gen
