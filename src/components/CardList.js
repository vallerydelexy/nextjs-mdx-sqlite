const cardList = (data) =>
<ul className="space-y-3">
      {data.map((item, index) => (
        <li key={index} className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md">
            {item.title}
        </li>
      ))}
    </ul>
export default cardList