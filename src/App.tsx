import "./App.css";
import { useState } from "react";

type APIREFERENCE = {
  request: {
    method: "GET";
    name: string;
    url: string;
    body?: string;
  };
  response: { status: 200 | 404; data: string };
};

const apiReference: APIREFERENCE[] = [
  {
    request: {
      method: "GET",
      name: "Random Quote",
      url: "/random",
      body: `
  {
      maxLength: number,
      minLength: number,
      tags: string,
      author: string,
      authorId: string,
  }
      `,
    },
    response: {
      status: 200,
      data: `
  {
      _id: number,
      content: string,
      author: string,
      authorSlug: string,
      length: number,
      tags: string[],
  }
      `,
    },
  },
  {
    request: {
      method: "GET",
      name: "Random Quotes",
      url: "/random",
      body: `
  {
      limit: number,
      maxLength: number,
      minLength: number,
      tags: string,
      author: string,
      authorId: string,
  }
      `,
    },
    response: {
      status: 200,
      data: `
  [
    {
        _id: number,
        content: string,
        author: string,
        authorSlug: string,
        length: number,
        tags: string[],
    }
  ]
      `,
    },
  },
  {
    request: {
      method: "GET",
      name: "Quote By ID",
      url: "/quote/:id",
    },
    response: {
      status: 200,
      data: `
  {
      _id: number,
      content: string,
      author: string,
      authorSlug: string,
      length: number,
      tags: string[],
  }
      `,
    },
  },
];

function App() {
  const [apiRefIndex, setApiRefIndex] = useState<number>(0);
  // TODO get random quote again
  // TODO random theme each time you reload
  // TODO working API

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

      <hr className="divider" />

      <footer className="footer-container">
        <div className="api-container">
          <div className="column">
            <div className="api-link">https://quote-api.carladi.com/</div>

            <ul className="api-reference">
              {apiReference.map((item, index) => (
                <li
                  key={`apiReference-${index}`}
                  onClick={() => setApiRefIndex(index)}
                  className="api-reference__item"
                >
                  <span className="api-reference__item__method">
                    {item.request.method}
                  </span>
                  <span className="api-reference__item__name">
                    {item.request.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="column">
            <div className="column__title">Request</div>
            <div className="request">
              <div className="request__url">
                {apiReference[apiRefIndex].request.url}
              </div>
              {apiReference[apiRefIndex].request.body && (
                <pre>
                  <code>{apiReference[apiRefIndex].request.body}</code>
                </pre>
              )}
            </div>
          </div>
          <div className="column">
            <div className="column__title">Response</div>
            <div className="response">
              <div className="response__status">
                {apiReference[apiRefIndex].response.status}
              </div>
              <pre>
                <code>{apiReference[apiRefIndex].response.data}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="links-container">
          <div className="links-container__item">
            Github link{" "}
            <a
              href="https://github.com/lukePeavey/quotable"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/asdiAdi/quote
            </a>
          </div>
          <div className="links-container__item">
            This project is directly based from{" "}
            <a
              href="https://github.com/lukePeavey/quotable"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/lukePeavey/quotable
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
