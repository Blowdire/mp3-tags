import { Button, Col, Drawer, Input, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Formik } from "formik";
const MainScreen = ({}) => {
  //component state
  const [FileList, setFileList] = useState(null);
  const [ModalEditVisible, setModalEditVisible] = useState(false);
  const [SelectedSong, setSelectedSong] = useState(null);
  //functions
  const getTags = async (fileList) => {
    let tempFileList = [];
    for (let i = 0; i < fileList.length; i++) {
      let currentFile = fileList[i];
      let result = await window.electronAPI.getFile(currentFile.path);
      tempFileList.push({
        name: currentFile.name,
        path: currentFile.path,
        ...result,
      });
    }
    setFileList(tempFileList);
    console.log("list", tempFileList);
  };

  const handleEdit = (values, { setSubmitting }) => {
    let tags = {
      title: values.title,
      album: values.album,
      artist: values.artist,
      image: values.image,
    };
  };
  //use effects

  return (
    <>
      {" "}
      {SelectedSong && (
        <Formik
          initialValues={{
            title: SelectedSong.title,
            album: SelectedSong.album,
            artist: SelectedSong.artist,
            image: SelectedSong.image,
          }}
          onSubmit={handleEdit}
        >
          {({
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isValid,
            isSubmitting,
            dirty,
          }) => (
            <Drawer
              onClose={() => {
                setSelectedSong(null);
                setModalEditVisible(false);
              }}
              footer={
                <Row justify="end">
                  <Button
                    type="primary"
                    loading={isSubmitting}
                    disabled={!dirty}
                  >
                    Salva
                  </Button>
                </Row>
              }
              visible={ModalEditVisible}
              title={
                <Row justify="center">
                  <span>Modifica canzone</span>
                </Row>
              }
              width={"100%"}
            >
              <Col span={24}>
                <Row justify="center">
                  <img
                    style={{ width: 200 }}
                    src={`data:image/png;base64,${values.image}`}
                  />
                </Row>
                <Row
                  justify="space-between"
                  gutter={[15, 15]}
                  style={{ marginTop: 15 }}
                >
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <span>Titolo</span>
                    <Input
                      type={"text"}
                      value={values.title}
                      onChange={(value) =>
                        setFieldValue("title", value.target.value)
                      }
                      onBlur={handleBlur}
                    />
                  </Col>
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <span>Album</span>
                    <Input
                      type={"text"}
                      value={values.album}
                      onChange={(value) =>
                        setFieldValue("album", value.target.value)
                      }
                      onBlur={handleBlur}
                    />
                  </Col>
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <span>Artista</span>
                    <Input
                      type={"text"}
                      value={values.artist}
                      onChange={(value) =>
                        setFieldValue("artist", value.target.value)
                      }
                      onBlur={handleBlur}
                    />
                  </Col>
                </Row>
              </Col>
            </Drawer>
          )}
        </Formik>
      )}
      <Col style={{ padding: 15 }}>
        <Row>
          <Col span={24}>
            <Row justify="center">
              <span style={{ textAlign: "center", fontSize: 17 }}>
                Homepage
              </span>
            </Row>
          </Col>
          <Upload
            accept=".mp3"
            beforeUpload={(file, fileList) => {
              if (!FileList) {
                getTags(fileList);
              }
              return false;
            }}
            directory
            showUploadList={false}
            customRequest={() => {
              return;
            }}
          >
            <Button>Scegli cartella</Button>
          </Upload>
        </Row>
        <Row>
          <Col span={24}>
            {FileList && (
              <Table dataSource={FileList}>
                <Table.Column
                  dataIndex={"name"}
                  title={"Nome File"}
                  key={"name"}
                />
                <Table.Column
                  dataIndex={"path"}
                  title={"Percorso file"}
                  key={"path"}
                />
                <Table.Column
                  dataIndex={"title"}
                  title="Titolo"
                  key={"title"}
                />
                <Table.Column
                  dataIndex={"image"}
                  title="Immagine"
                  key={"image"}
                  render={(value, record, index) => {
                    return (
                      <img
                        style={{ width: 60 }}
                        src={`data:image/png;base64,${value}`}
                      />
                    );
                  }}
                />
                <Table.Column
                  fixed="right"
                  width={50}
                  render={(value, record, index) => {
                    return (
                      <EditOutlined
                        onClick={() => {
                          setSelectedSong(value);
                          setModalEditVisible(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  }}
                />
              </Table>
            )}
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default MainScreen;
