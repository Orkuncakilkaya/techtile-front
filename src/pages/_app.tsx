import '../../styles/globals.scss';
import type {AppContext, AppProps} from 'next/app';
import MainLayout from '../layouts/main';
import {SSRProvider} from '@restart/ui/ssr';
import App from 'next/app';
import {UserProvider} from '../context/user.context';

const Application = ({Component, pageProps}: AppProps) => {
    const {user, token} = pageProps;
    return (
        <SSRProvider>
            <UserProvider value={{isLoggedIn: !!user, token, user}}>
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </UserProvider>
        </SSRProvider>
    );
};

Application.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);
    const {ctx} = appContext;

    const token = ctx.req?.headers.cookie?.replace('auth=', '');

    const response = fetch('http://localhost:5567/auth/me', {
        headers: token ? {'Authorization': `Bearer ${token}`} : undefined,
    });

    try {
        const {status, body} = await response.then(async (res) => ({status: res.status, body: await res.json()}));
        if (status === 200) {
            const user = body.data.user;
            return {...appProps, pageProps: {...appProps.pageProps, user, token}};
        }
        return {...appProps, pageProps: {...appProps.pageProps, user: undefined, token}};
    } catch (_) {
        return {...appProps, pageProps: {...appProps.pageProps, user: undefined, token}};
    }
};

export default Application;
