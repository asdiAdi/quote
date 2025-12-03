import "./App.css";
import { useEffect, useState } from "react";
import getDailyQuote from "./api/getDailyQuote.ts";
import outputs from "../amplify_outputs.json";

type APIREFERENCE = {
  request: {
    method: "GET";
    name: string;
    url: string;
    query?: {
      param: string;
      type: string;
      description: string;
    }[];
  };
  response: { status: 200 | 404; data: string };
};

const apiReference: APIREFERENCE[] = [
  {
    request: {
      method: "GET",
      name: "Random Quote(s)",
      url: "/random",
      query: [
        {
          param: "limit",
          type: "int",
          description: "The number of random quotes to retrieve.",
        },
        {
          param: "minLength",
          type: "int",
          description: "The minimum Length in characters.",
        },
        {
          param: "maxLength",
          type: "int",
          description: "The maximum Length in characters.",
        },
        {
          param: "tags",
          type: "string",
          description: "Get a random quote with specific tag(s).",
        },
        {
          param: "author",
          type: "string",
          description: "Get a random quote by one author.",
        },
      ],
    },
    response: {
      status: 200,
      data: `
  [
    {
        id: number,
        content: string,
        author: string,
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
      name: "Quote of the Day",
      url: "/daily-quote",
    },
    response: {
      status: 200,
      data: `
  {
      id: number,
      content: string,
      author: string,
      length: number,
      tags: string[],
  }
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
      id: number,
      content: string,
      author: string,
      length: number,
      tags: string[],
  }
      `,
    },
  },
  {
    request: {
      method: "GET",
      name: "Tags",
      url: "/tags",
      query: [
        {
          param: "sortBy",
          type: "enum",
          description: "name, quoteCount",
        },
        {
          param: "order",
          type: "enum",
          description: "asc, desc",
        },
      ],
    },
    response: {
      status: 200,
      data: `
  {
      id: number,
      name: string,
      
      // if sorted by quoteCount
      count: number, 
  }
      `,
    },
  },
];

function App() {
  const [apiRefIndex, setApiRefIndex] = useState<number>(0);
  const [dailyQuote, setDailyQuote] = useState<string>("");
  const [dailyAuthor, setDailyAuthor] = useState<string>("");

  // TODO get random quote again
  // TODO random theme each time you reload
  // TODO working API

  const params = apiReference[apiRefIndex].request.query;

  useEffect(() => {
    (async () => {
      // your async code here
      const data = await getDailyQuote();
      if (data) {
        const { content, author } = data || {};
        setDailyQuote(
          content ??
            "The best way to get started is to quote talking and begin doing.",
        );
        setDailyAuthor(author ?? "Walt Disney");
      }
    })();
  }, []);

  return (
    <>
      <main className="quote-container">
        <h2 className="title">QUOTE OF THE DAY</h2>
        <h1 className="quote">{dailyQuote && <q>{dailyQuote}</q>}</h1>

        <div className="author">
          <h3 className="author__name">{dailyAuthor}</h3>
          <hr className="author__divider" />
        </div>
      </main>

      <hr className="divider" />

      <footer className="footer-container">
        <div className="api-container">
          <div className="column">
            <div className="api-link">https://api-quotes.carladi.com/</div>
            <div className="api-header">
              <div className="api-header-title">Headers:</div>
              X-API-Key:
              <button
                className="api-header-button"
                onClick={() =>
                  navigator.clipboard
                    .writeText(outputs.custom.publicApiKey)
                    .then(() => {
                      alert("Copied to clipboard");
                    })
                }
              >
                Copy
              </button>
            </div>

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
              {!!params && (
                <table className="request__params">
                  <thead>
                    <tr>
                      <th>param</th>
                      <th>type</th>
                      <th>description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map(({ param, type, description }, index) => (
                      <tr key={`params-${index}`}>
                        <td>{param}</td>
                        <td>{type}</td>
                        <td>{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
