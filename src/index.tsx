import { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serveStatic from 'serve-static';
import polka from 'polka';
import { RequestContext } from './framework/useRequest';
import './index.css';

fs.readFile(path.resolve('./dist/index.html'), 'utf8', (err, template) => {
    if (err) {
        console.error('Something went wrong:', err);
        return;
    }

    function renderComponent(req: IncomingMessage, res: ServerResponse, component: React.ReactElement) {

        const content = ReactDOMServer.renderToStaticMarkup((
            <RequestContext.Provider value={ req }>
                { component }
            </RequestContext.Provider>
        ));

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(template.replace('<div id="root"></div>', `<div id="root">${ content }</div>`));
        res.end();
    }

    const server = polka({
        onNoMatch(req: polka.Request, res: ServerResponse) {
            renderComponent(req, res, <div>Route { req.url } not found</div>);
        }
    });

    server.use('/static', serveStatic(path.join(__dirname, 'static')));

    server.get('/', (req, res) => {
        renderComponent(req, res, <div>Hello, world</div>)
    })

    server.listen(3000, err => {
        if (err) {
            throw err;
        }

        console.log(`> Running on localhost:3000`);
    });
});
