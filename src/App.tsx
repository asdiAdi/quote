import "./App.css";

function App() {
  return (
    <>
      <main className="quote-container">
        <h2 className="title">QUOTE OF THE DAY</h2>
        <h1 className="quote">
          <q>
            The best way to get started is to quote talking and begin doing.
          </q>
        </h1>

        <div className="author">
          <h3 className="author__name">Walt Disney</h3>
          <hr className="author__divider" />
        </div>
      </main>

      {/*<hr className="divider" />*/}
      {/*TODO API List*/}
      {/*<footer className="footer-container">
        <div className="api-container">
          <div className="column"></div>
          <div className="column">Request</div>
          <div className="column">Response</div>
        </div>
        <div className="link-container"></div>
      </footer>*/}
    </>
  );
}

export default App;
