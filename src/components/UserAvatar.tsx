// import { ChevronDownIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
interface UserAvatarProps {
    image: string;
}
export const UserAvatar = ({ image }: UserAvatarProps) => {
    return (
        <Menu as="div" className={'relative flex items-center'}>
            <Menu.Button className="rounded-full self-center mr-4 ring-2 ring-purple-400 h-12 w-12">
                <img alt="profile" className="rounded-full" src={image} />
            </Menu.Button>
            <Menu.Items className="absolute right-4 mt-2 top-14 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-600 text-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                    {({ active }: any) => (
                        <button
                            className={`${
                                active
                                    ? 'bg-violet-500 text-slate-100'
                                    : 'text-slate-100'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </button>
                    )}
                </Menu.Item>
            </Menu.Items>
            {/* </div> */}
        </Menu>
        // </div>
    );
};
