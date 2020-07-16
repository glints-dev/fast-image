import React, { FunctionComponent } from "react";

export const ThumborContext = React.createContext<string | null>(null);

export interface ThumborProviderInterface {
  thumborServerURL: string;
}

export const ThumborProvider: FunctionComponent<ThumborProviderInterface> = ({
  thumborServerURL,
  children,
}) => (
  <ThumborContext.Provider value={thumborServerURL}>
    {children}
  </ThumborContext.Provider>
);

export const ThumborConsumer = ThumborContext.Consumer;
