import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReaderProvider } from './context/ReaderContext';
import UploadScreen from './routes/UploadScreen';
import ContentsScreen from './routes/ContentsScreen';
import PlayerScreen from './routes/PlayerScreen';

export default function App() {
  return (
    <BrowserRouter>
      <ReaderProvider>
        <Routes>
          <Route path="/" element={<UploadScreen />} />
          <Route path="/contents" element={<ContentsScreen />} />
          <Route path="/player" element={<PlayerScreen />} />
        </Routes>
      </ReaderProvider>
    </BrowserRouter>
  );
}
