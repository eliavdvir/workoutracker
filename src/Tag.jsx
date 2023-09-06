function Tag({ tagText, addNewTag }) {
  return (
    <div className="tag-export" onClick={() => addNewTag(tagText)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="10"
        viewBox="0 0 320 320"
        fill="none"
      >
        <path
          d="M160 16V304M304 160H16"
          stroke="#4f4f4f"
          strokeWidth="40"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text2">{tagText}</div>
    </div>
  )
}

export default Tag
