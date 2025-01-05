import Badge from "@/components/Badge";
export default function PortofolioCard({
  logo,
  logoAlt,
  image,
  imageAlt,
  domain,
  title,
  description,
  year,
  stacks,
}) {
  return (
    <div className="my-5 mb-8 shadow-lg max-w-screen-sm">
      <div>
        <img
          src={image}
          alt={imageAlt}
          className=" w-full object-cover object-center rounded-t-lg"
        />
      </div>
      <div className="p-4 pt-4 bg-white bg-opacity-25 dark:bg-opacity-100 backdrop-filter backdrop-blur-sm rounded-b-lg">
        <div className="flex justify-between">
          <div>
            <div className="mb-2">
              <h3 className="text-2xl font-semibold text-indigo-800 hover:underline">
                {title} <span className="text-gray-400 font-light">{`(${year})`}</span>
              </h3>
              <span className="text-gray-400 text-xs" >{domain}</span>
            </div>

            <p className="text-sm text-gray-800">{description}</p>
          </div>
          <div>
            <img
              src={logo}
              alt={logoAlt}
              className="max-h-6 md:max-h-10 object-cover object-center "
            />
          </div>
        </div>
        <div className="pt-4">
          <p className="text-sm text-gray-600">Teknologi yang digunakan:</p>
          <div className="flex flex-wrap">
            {stacks?.map((stack, i) => {
              return <Badge key={i} text={stack} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
