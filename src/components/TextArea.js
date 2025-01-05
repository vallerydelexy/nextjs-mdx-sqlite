"use client"
import { Tab } from "@headlessui/react"
import { useState, useRef } from "react"
import { MdEditor, MdCatalog, MdPreview } from "md-editor-rt"
import { classNames, slugify } from "@/utils/helper"
import axios from "axios"
import "md-editor-rt/lib/style.css"
import { RefreshIcon, SaveIcon } from "@heroicons/react/outline"
import { CldImage } from "next-cloudinary"
import { useRouter } from "next/navigation"
import { getCookie  } from "cookies-next";

export default function TextArea({ postData }) {
	const router = useRouter()
	const jwt = getCookie("jwt")
	const authorizationHeader = {
		headers: {
			"authorization": jwt,
		},
	}
	let [id, setId] = useState(postData?.id || undefined)
	const [title, setTitle] = useState(postData?.title || undefined)
	const [text, setText] = useState(postData?.content || undefined)
	const [coverImage, setCoverImage] = useState(
		postData?.thumbnailUrl || undefined,
	)
	const [coverAlt, setCoverAlt] = useState(postData?.thumbnailAlt || undefined)
	const editorRef = useRef()
	const coverImageInput = useRef()
	const [tags, setTags] = useState(
		postData?.tags
			.map(({ name }) => name)
			.toString()
			.replaceAll(",", ", ") || undefined,
	)

	const [loading, setLoading] = useState(false)

	async function onSave(value, html) {
		setLoading(true)
		const postUrl = id
			? `${process.env.NEXT_PUBLIC_API}/post/${postData.slug}`
			: `${process.env.NEXT_PUBLIC_API}/post`
		const slug = slugify(title)
		if (title && value && tags && coverImage) {
			try {
				const res = await axios.post(postUrl, {
					author: "Rizki Aprita",
					title: title,
					slug: slug,
					description: value?.slice(0, 155),
					thumbnailUrl: coverImage,
					thumbnailAlt: "",
					draft: false,
					tags: tags?.trim().split(", "),
					content: value,
				}, authorizationHeader)
				setId(res?.data?.id)
				setLoading(false)
				router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/posts/${slug}`)
			} catch (error) {
				setLoading(false)
				console.error("Error occurred:", error)
			}
		} else {
			setLoading(false)
			console.log(
				title && value && tags && coverImage,
				title,
				value,
				tags,
				coverImage,
			)
		}
	}

	async function uploadCoverImage(FileList) {
		setLoading(true)
		const files = Array.from(FileList)
		const res = await Promise.all(
			files.map((file) => {
				return new Promise((rev, rej) => {
					const form = new FormData()
					form.append("file", file)
					form.append("upload_preset", "k3johyh2")

					axios
						.post(
							`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
							form,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							},
						)
						.then((res) => rev(res))
						.catch((error) => rej(error))
						.finally(setLoading(false))
				})
			}),
		)

		res.map((item) => setCoverImage(item.data.url))
	}

	const handleUploadCoverImageClick = (e) => {
		e.preventDefault()
		if (coverImageInput.current) {
			coverImageInput.current.click()
		}
	}

	const handleCoverImageChange = (event) => {
		event.preventDefault()
		uploadCoverImage(event.target.files)
	}

	async function onUploadImg(files, callback) {
		const res = await Promise.all(
			files.map((file) => {
				return new Promise((rev, rej) => {
					const form = new FormData()
					form.append("file", file)
					form.append("upload_preset", "k3johyh2")

					axios
						.post(
							`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
							form,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							},
						)
						.then((res) => rev(res))
						.catch((error) => rej(error))
				})
			}),
		)

		callback(res.map((item) => item.data.url))
	}

	function triggerSave(e) {
		// e.preventDefault()
		editorRef.current?.triggerSave()
	}

	return (
		<div>
			<div className="py-4">
				<input
					onChange={handleCoverImageChange}
					ref={coverImageInput}
					type="file"
					accept="image/*"
					style={{ display: "none" }}
				/>
				<button
					onClick={handleUploadCoverImageClick}
					className={classNames(
						coverImage
							? "text-center"
							: "border-4 border-dashed border-gray-800 rounded-lg h-24 flex items-center justify-center group",
						"w-full",
					)}>
					<div
						className={classNames(
							coverImage ? "text-sm text-indigo-800" : "text-3xl text-gray-800",
							"font-bold group",
						)}>
						{coverImage && (
							<CldImage
								width="600"
								height="600"
								className="mx-auto rounded-md group-hover:outline group-hover:outline-1 group-hover:outline-indigo-800 max-h-[600] max-w-[600]"
								src={coverImage}
							/>
						)}
						<div
							className={classNames(
								coverImage ? "opacity-0 group-hover:opacity-100" : "",
								"",
							)}>
							{coverImage ? "Change image" : "Upload image"}
						</div>
					</div>
				</button>
			</div>

			<Tab.Group>
				{({ selectedIndex }) => (
					<>
						<Tab.List className="flex items-center gap-2">
							<Tab
								className={({ selected }) =>
									classNames(
										selected
											? "outline outline-2 bg-gray-900 outline-gray-200/25"
											: "",
										"text-gray-100 bg-gray-800 hover:bg-gray-900 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md",
									)
								}>
								Write
							</Tab>
							<Tab
								className={({ selected }) =>
									classNames(
										selected
											? "outline outline-2 bg-gray-900 outline-gray-200/25"
											: "",
										"text-gray-100 bg-gray-800 hover:bg-gray-900 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md",
									)
								}>
								Preview
							</Tab>

							{/* These buttons are here simply as examples and don't actually do anything. */}
							{selectedIndex === 0 ? (
								<button
									onClick={(e) => triggerSave(e)}
									disabled={loading}
									className="ml-auto disabled:bg-gray-800 flex items-center space-x-5 text-gray-100 bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md">
									<div className="flex items-center flex-row gap-2">
										<span className="">{!loading ? "Save" : "Saving"}</span>
										<div className="-m-2.5 w-10 h-10 inline-flex items-center justify-center ">
											{loading && (
												<RefreshIcon className=" animate-spin h5 w-5" />
											)}

											{!loading && (
												<SaveIcon className="h-5 w-5" aria-hidden="true" />
											)}
										</div>
									</div>
								</button>
							) : null}
						</Tab.List>
						<Tab.Panels className="mt-2">
							<Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
								<label htmlFor="comment" className="sr-only">
									Write
								</label>
								<div className="flex flex-col gap-4">
									<input
										onChange={(e) => setTitle(e.target.value)}
										value={title}
										placeholder="Title.."
										className="border-1 border border-gray/25 focus:shadow-md block w-full sm:text-sm border-gray-300 rounded-md p-4 focus:outline-none"
									/>
									<p className="text-gray-300 text-sm">
										slug: {slugify(title)}
									</p>
									<MdEditor
										onSave={onSave}
										ref={editorRef}
										onUploadImg={onUploadImg}
										preview={false}
										theme="dark"
										previewTheme="github"
										editorId="MdEditor-1"
										language="en-US"
										className="border-1 border border-gray/25 focus:shadow-md block w-full sm:text-sm border-gray-300 rounded-md p-4 focus:outline-none"
										modelValue={text}
										onChange={setText}
									/>
									<input
										onChange={(e) => setTags(e.target.value)}
										placeholder="Tags"
										className="border-1 border border-gray/25 focus:shadow-md block w-full sm:text-sm border-gray-300 rounded-md p-4 focus:outline-none"
										value={tags}
									/>
								</div>
							</Tab.Panel>
							<Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
								<div className="border-b">
									<div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800 flex flex-col gap-4">
										<div className="max-w-7xl mx-auto">
											<h1 className="text-2xl font-semibold text-gray-100">
												{title}
											</h1>
											<p className="text-gray-300 text-center">
												{slugify(title)}
											</p>
										</div>

										<MdPreview
											theme="dark"
											previewTheme="github"
											editorId="Mdpreview-1"
											modelValue={text}
											className="rounded-lg min-h-screen"
										/>
									</div>
								</div>
							</Tab.Panel>
						</Tab.Panels>
					</>
				)}
			</Tab.Group>
		</div>
	)
}
