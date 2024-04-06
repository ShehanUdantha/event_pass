import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import Profile from "./pages/Profile.jsx";
import ViewEvent from "./pages/ViewEvent.jsx";
import { StateContextProvider } from "./context";
import EditEvent from "./pages/EditEvent.jsx";
import NotFound from "./pages/NotFound.jsx";
import ViewTicket from "./pages/ViewTicket.jsx";
import Scanner from "./pages/Scanner.jsx";
import TicketHistory from "./pages/TicketHistory.jsx";
import RefundTicket from "./pages/RefundTicket.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/create-event",
        element: <CreateEvent />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/event/:id",
        element: <ViewEvent />,
      },
      {
        path: "/event/:id/edit",
        element: <EditEvent />,
      },
      {
        path: "/ticket-info/:ticketAddress/:ticketEvent/:id",
        element: <ViewTicket />,
      },
      {
        path: "/event/:id/scanner",
        element: <Scanner />,
      },
      {
        path: "/event/:id/ticket-history",
        element: <TicketHistory />,
      },
      {
        path: "/event/:id/ticket-refund",
        element: <RefundTicket />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <ThirdwebProvider
    clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
    activeChain={Sepolia}
    switchToActiveChain={true}
    supportedWallets={[
      metamaskWallet({ recommended: true }),
      coinbaseWallet(),
      walletConnect(),
    ]}
  >
    <StateContextProvider>
      <RouterProvider router={router} />
    </StateContextProvider>
  </ThirdwebProvider>
  // </React.StrictMode>
);
