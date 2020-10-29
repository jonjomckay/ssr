import React, { useContext } from 'react';
import { IncomingMessage } from 'http';

export const RequestContext = React.createContext(null);

export function useRequest(): IncomingMessage {
    return useContext(RequestContext);
}
