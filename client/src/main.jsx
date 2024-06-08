import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { StateContextProvider } from "./context";
import Home from "./pages/Home.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import Profile from "./pages/Profile.jsx";
import ViewEvent from "./pages/ViewEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import NotFound from "./pages/NotFound.jsx";
import ViewTicket from "./pages/ViewTicket.jsx";
import Scanner from "./pages/Scanner.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Media from "./pages/Media.jsx";
import About from "./pages/About.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";

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
        path: "/how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "/about",
        element: <About />,
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
        path: "/event/:id/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/event/:id/media",
        element: <Media />,
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
  <ThirdwebProvider
    clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
    activeChain={Sepolia}
    switchToActiveChain={true}
    supportedWallets={[metamaskWallet({ recommended: true }), coinbaseWallet()]}
  >
    <StateContextProvider>
      <RouterProvider router={router} />
    </StateContextProvider>
  </ThirdwebProvider>
);
