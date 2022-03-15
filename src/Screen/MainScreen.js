import { Button, Col, Drawer, Input, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { ProgressBar } from "react-bootstrap";
import DrawerAutoSearch from "../Components/DrawerAutoSearch";
const MainScreen = ({}) => {
  //component state
  const [FileList, setFileList] = useState([]);
  const [ModalEditVisible, setModalEditVisible] = useState(false);
  const [SelectedSong, setSelectedSong] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Progress, setProgress] = useState(0);
  //functions
  const getTags = async (fileList) => {
    setLoading(true);
    setProgress(0);
    let tempFileList = [];
    for (let i = 0; i < fileList.length; i++) {
      let currentFile = fileList[i];
      let result = await window.electronAPI.getFile(currentFile.path);
      tempFileList.push({
        index: i,
        name: currentFile.name,
        path: currentFile.path,
        ...result,
      });
      setProgress((i / fileList.length) * 100);
    }
    setFileList(tempFileList);
    setLoading(false);
    setProgress(0);
  };

  const handleEdit = async (values, { setSubmitting }) => {
    console.log("SELECTEDSONG", values);
    let tags = {
      title: values.title,
      album: values.album,
      artist: values.artist,
      image: values.image,
    };
    let result = await window.electronAPI.setFile(SelectedSong.path, tags);
    if (result === true) {
      let tempFileList = FileList;
      tempFileList[SelectedSong.index].title = values.title;
      tempFileList[SelectedSong.index].album = values.album;
      tempFileList[SelectedSong.index].artist = values.artist;
      tempFileList[SelectedSong.index].image = values.image;
      console.log("Edited", tempFileList[SelectedSong.index]);
      setFileList([...tempFileList]);
      setSelectedSong(null);
      setModalEditVisible(false);
    }
  };
  const handleSearch = async (setFieldValue, values) => {
    let result = await window.electronAPI.searchSong({
      values,
      filename: SelectedSong.name,
    });
    console.log(result[0]);
    setFieldValue("title", result[0].name);
    setFieldValue("album", result[0].album.name);
    setFieldValue("artist", result[0].artists[0].name);
    setFieldValue("image", result[0].defaultImage);

    console.log(result);
  };
  //use effects
  useEffect(() => {
    console.log("LIST", FileList);
  }, [FileList]);
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
                <Row justify="end" gutter={[15, 0]}>
                  <Col>
                    <Button
                      type="default"
                      onClick={() => {
                        setSelectedSong(null);
                        setModalEditVisible(false);
                      }}
                    >
                      Chiudi
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      loading={isSubmitting}
                      disabled={!dirty}
                      onClick={handleSubmit}
                    >
                      Salva
                    </Button>
                  </Col>
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
                <Row style={{ marginTop: 15 }}>
                  <Col span={24}>
                    <Button
                      block
                      onClick={() => {
                        handleSearch(setFieldValue, values);
                      }}
                    >
                      Ricerca automatica
                    </Button>
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
            style={{ marginBottom: 15 }}
            accept=".mp3"
            beforeUpload={(file, fileList) => {
              // let tempFileList = [...FileList];
              // let result = await window.electronAPI.getFile(file.path);

              // console.log("LIST", tempFileList);
              // setFileList([
              //   ...tempFileList,
              //   {
              //     index: tempFileList.length - 1,
              //     name: file.name,
              //     path: file.path,
              //     ...result,
              //   },
              // ]);
              // return "false";
              if (file.path === fileList[0].path) {
                console.log("+++++++++++++++++++++++++", fileList);
                getTags(fileList);
                return;
              }
              console.log(file);
              return;
            }}
            directory
            showUploadList={false}
            customRequest={() => {
              return false;
            }}
          >
            <Button>Scegli cartella</Button>
          </Upload>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col span={24}>
            {Loading && <ProgressBar now={Progress} />}

            {FileList.length > 0 && (
              <>
                <Table dataSource={[...FileList]}>
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
                    render={(value, record, index) => {
                      return <span>{value}</span>;
                    }}
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
                            setSelectedSong({ ...value });
                            setModalEditVisible(true);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                  />
                </Table>
                <DrawerAutoSearch
                  songs={FileList}
                  callbackUpdate={(newFileList) => {
                    setFileList([...newFileList]);
                  }}
                />
              </>
            )}
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default MainScreen;
