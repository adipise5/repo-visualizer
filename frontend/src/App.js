import React, { useState } from 'react';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');

  const extractRepoDetails = (url) => {
    const parts = url.split('/');
    const owner = parts[3];
    const repo = parts[4];
    return { owner, repo };
  };

  const fetchRepoFiles = async () => {
    const { owner, repo } = extractRepoDetails(repoUrl);
    const response = await fetch(`http://localhost:8000/repo/tree?owner=${owner}&repo=${repo}`);
    const data = await response.json();
    setFiles(data.files);
  };

  const fetchFileContent = async (path) => {
    const { owner, repo } = extractRepoDetails(repoUrl);
    const response = await fetch(`http://localhost:8000/repo/file?owner=${owner}&repo=${repo}&file_path=${path}`);
    const data = await response.json();
    setSelectedContent(data.content);
  };

  return (
    <div className="App">
      <h1>GitHub Repo Visualizer</h1>
      <input type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="Enter GitHub repo URL" style={{ width: '60%' }} />
      <button onClick={fetchRepoFiles}>Load Repo</button>
      <div className="container">
        <div className="left">
          <h2>Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file.path} onClick={() => fetchFileContent(file.path)}>
                {file.path}
              </li>
            ))}
          </ul>
        </div>
        <div className="right">
          <h2>File Content</h2>
          <pre>{selectedContent}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;

