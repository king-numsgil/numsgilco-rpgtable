import {MantineProvider, TypographyStylesProvider} from "@mantine/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Notifications} from "@mantine/notifications";
import {HelmetProvider} from "react-helmet-async";
import {ModalsProvider} from "@mantine/modals";
import {httpBatchLink} from "@trpc/client";
import ReactDOM from "react-dom/client";
import React from "react";

import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';

import {routes} from "routes";
import {theme} from "theme";
import {trpc} from "trpc";

const router = createBrowserRouter(routes);

const Main: React.FC = () => {
    const [queryClient] = React.useState(() => new QueryClient());
    const [trpcClient] = React.useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/trpc',
                    async headers() {
                        const token = localStorage.getItem("token");
                        if (token === null) {
                            return {};
                        }

                        return {
                            authorization: `Bearer ${token}`,
                        };
                    },
                }),
            ],
        }),
    );

    return <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme} defaultColorScheme="dark">
                    <TypographyStylesProvider>
                        <ModalsProvider>
                            <Notifications/>
                            <RouterProvider router={router}/>
                        </ModalsProvider>
                    </TypographyStylesProvider>
                </MantineProvider>
            </QueryClientProvider>
        </HelmetProvider>
    </trpc.Provider>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Main/>
    </React.StrictMode>,
);
