import { NextPage } from 'next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignIn: NextPage = ({ providers }: any) => {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        console.log(status);
        if (status === 'authenticated') {
            console.log('User is authenticated!');
            router.push('http://localhost:3000/', undefined, {
                shallow: false,
            });
        }
    }, [status]);
    return (
        <main className="flex items-center justify-center min-h-screen dark:bg-slate-900 dark:text-slate-100">
            {Object.values(providers).map((provider: any) => (
                <div key={provider.name}>
                    <button
                        onClick={() => signIn(provider.id)}
                        className="px-4 py-2 rounded-md shadow-md border-2 border-purple-400 text-purple-200 font-semibold hover:scale-110 transition-all duration-300"
                    >
                        Sign in with {provider.name}
                    </button>
                </div>
            ))}
        </main>
    );
};

export default SignIn;
export async function getServerSideProps(context: any) {
    const providers = await getProviders();
    return {
        props: { providers },
    };
}
