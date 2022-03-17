import { Button, Drawer, Row, Col, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

const DrawerAutoSearch = ({ songs, callbackUpdate }) => {
  //states
  const [DrawerVisible, setDrawerVisible] = useState(false);
  const [Results, setResults] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Progress, setProgress] = useState(0);
  //functions
  useEffect(() => {
    console.log("songs", songs);
  }, [songs]);
  const saveResults = async () => {
    setLoading(true);
    for (let i = 0; i < Results.length; i++) {
      let currentSong = Results[i];
      let tags = {
        title: currentSong.title,
        album: currentSong.album,
        artist: currentSong.artist,
        image: currentSong.image,
      };
      let result = await window.electronAPI.setFile(currentSong.path, tags);
      setProgress((i / Results.length) * 100);
    }
    callbackUpdate(Results);
    setLoading(false);
    setProgress(0);
    setDrawerVisible(false);
  };
  const startSearch = async () => {
    setLoading(true);
    let results = [];
    for (let i = 0; i < songs.length; i++) {
      let currentSong = { ...songs[i] };
      let result = await window.electronAPI.searchSong({
        values: { ...currentSong },
        filename: currentSong.name,
      });
      if (result && result.length > 0) {
        currentSong.title = result[0].name;
        currentSong.album = result[0].album.name;
        currentSong.artist = result[0].artists[0].name;
        currentSong.image = result[0].defaultImage;
      }
      results.push({
        ...currentSong,
      });
      setProgress((i / songs.length) * 100);
    }
    setResults(results);
    setProgress(0);
    setLoading(false);
  };
  return (
    <>
      <Drawer
        visible={DrawerVisible}
        width={"100%"}
        destroyOnClose
        footer={
          <Row justify="end">
            <Button
              type="primary"
              disabled={Results.length === 0}
              onClick={() => {
                saveResults();
              }}
            >
              Salva
            </Button>
          </Row>
        }
        onClose={() => {
          setDrawerVisible(false);
        }}
      >
        <h2 style={{ textAlign: "center" }}>Ricerca automatica</h2>
        {!Loading && (
          <Row justify="center">
            <Button
              onClick={() => {
                startSearch();
              }}
            >
              Start
            </Button>
          </Row>
        )}
        {Loading && <ProgressBar now={Progress} />}

        <Row justify="space-between">
          <Col span={12}>
            <h4>Prima</h4>
            <Table dataSource={[...songs]}>
              <Table.Column
                dataIndex={"title"}
                title="Titolo"
                key={"title"}
                render={(value, record, index) => {
                  return <span>{value ? value : record.name}</span>;
                }}
              />
              <Table.Column
                dataIndex={"image"}
                title="Immagine"
                key={"image"}
                render={(value, record, index) => {
                  return (
                    <img
                      style={{ width: 50, height: 50 }}
                      src={`data:image/png;base64,${value}`}
                    />
                  );
                }}
              />
            </Table>
          </Col>
          <Col span={12}>
            {Results.length > 0 && (
              <>
                <h4>Dopo</h4>

                <Table dataSource={[...Results]}>
                  <Table.Column
                    dataIndex={"title"}
                    title="Titolo"
                    key={"title"}
                    render={(value, record, index) => {
                      return <span>{value ? value : record.name}</span>;
                    }}
                  />
                  <Table.Column
                    dataIndex={"image"}
                    title="Immagine"
                    key={"image"}
                    render={(value, record, index) => {
                      return (
                        <img
                          style={{ width: 50, height: 50 }}
                          src={`data:image/png;base64,${value}`}
                        />
                      );
                    }}
                  />
                </Table>
              </>
            )}
          </Col>
        </Row>
      </Drawer>
      <Button
        onClick={() => {
          setDrawerVisible(true);
        }}
        block
      >
        Ricerca automatica
      </Button>
    </>
  );
};
export default DrawerAutoSearch;
