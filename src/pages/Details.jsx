import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const isAPIEvent = (id) => {
  return id.length > 10;
}

export default function Details() {
  const { id } = useParams();
  // const [isAPIEvent] = useState(isAPIEvent(id));

  useEffect(() => {
    console.log(isAPIEvent(id));
  })

  return (
    <div className="bg-rose-300 fixed inset-0 top-[64px] z-20">
      Details for: 
      {id}
    </div>
  )
}