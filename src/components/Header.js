import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, SunIcon, MoonIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import useThemeStore from '@/utils/store/theme.store';
import Logo from './logo';

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Portfolio', href: '/#portfolio' },
	{ name: 'Blog', href: 'https://blog.aprita.web.id/' },
];

export default function Header({ tagline }) {
	const { mode, setLightMode, setDarkMode } = useThemeStore();
	const isDarkMode = mode === 'dark';

	const handleModeToggle = () => {
		isDarkMode ? setLightMode() : setDarkMode();
	};

	return (
		<div className='relative z-50 bg-gray-100 py-4 dark:bg-gray-900 md:pt-6'>
			<Popover>
				{({ open }) => (
					<>
						<div className='z-50 mx-auto max-w-7xl px-4 sm:px-6'>
							<nav
								className='relative flex items-center justify-between sm:h-10 md:justify-center'
								aria-label='Global'>
								<div className='flex flex-1 items-center md:absolute md:inset-y-0 md:left-0'>
									<div className='flex w-full items-center justify-between md:w-auto'>
										<Link href='/'>
											<Logo className='h-8 w-8 fill-gray-900 dark:fill-gray-100' />
										</Link>

										<Link href='/' passHref legacyBehavior>
											<span className='md:hidden'>{tagline}</span>
										</Link>
										<div className='flex gap-4 md:hidden'>
											<div className='inline-flex rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 shadow backdrop-blur-sm backdrop-filter hover:bg-gray-50'>
												<button onClick={handleModeToggle}>
													{isDarkMode ? (
														<SunIcon className='h-6 w-6' />
													) : (
														<MoonIcon className='h-6 w-6' />
													)}
												</button>
											</div>
											<div className='flex items-center'>
												<Popover.Button className='inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 backdrop-blur-sm backdrop-filter hover:bg-gray-100 hover:text-gray-500 focus:outline-none'>
													<span className='sr-only'>Open main menu</span>
													<MenuIcon className='h-6 w-6' aria-hidden='true' />
												</Popover.Button>
											</div>
										</div>
									</div>
								</div>
								<div className='hidden gap-4 md:flex md:space-x-10'>
									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											passHref
											legacyBehavior>
											<span
												role='button'
												className='font-medium text-gray-500 dark:text-gray-100'>
												{item.name}
											</span>
										</Link>
									))}
								</div>
								<div className='hidden gap-4 md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end'>
									<div className='inline-flex rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 shadow backdrop-blur-sm backdrop-filter hover:bg-gray-50'>
										<button onClick={handleModeToggle}>
											{isDarkMode ? (
												<SunIcon className='h-6 w-6' />
											) : (
												<MoonIcon className='h-6 w-6' />
											)}
										</button>
									</div>
									<span className='inline-flex rounded-md shadow'>
										<a
											href='https://wa.me/6281276763536'
											className='inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 backdrop-blur-sm backdrop-filter hover:bg-gray-50'>
											Hubungi
										</a>
									</span>
								</div>
							</nav>
						</div>

						<Transition
							show={open}
							as={Fragment}
							enter='duration-150 ease-out'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='duration-100 ease-in'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Popover.Panel
								focus
								static
								className='absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden'>
								<div className='overflow-hidden rounded-lg bg-white/75 shadow-md ring-1 ring-black ring-opacity-5 backdrop-blur-sm backdrop-filter'>
									<div className='flex items-center justify-between px-5 pt-4'>
										<div>
											<Logo className='h-8 w-8 fill-gray-100 dark:fill-gray-900' />
										</div>
										<div className=''>
											<Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 backdrop-blur-sm backdrop-filter hover:bg-gray-100 hover:text-gray-500 focus:outline-none'>
												<span className='sr-only'>Close menu</span>
												<XIcon className='h-6 w-6' aria-hidden='true' />
											</Popover.Button>
										</div>
									</div>
									<div className='px-2 pb-3 pt-2'>
										{navigation.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												passHref
												legacyBehavior>
												<span
													role='button'
													className='block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900'>
													{item.name}
												</span>
											</Link>
										))}
									</div>
									<a
										href='https://wa.me/6281276763536'
										className='block w-full bg-gray-50 px-5 py-3 text-center font-medium text-indigo-600 backdrop-blur-sm backdrop-filter hover:bg-gray-100'>
										Hubungi
									</a>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</div>
	);
}
