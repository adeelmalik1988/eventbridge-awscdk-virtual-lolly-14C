import React from "react"
import { navigate } from "gatsby"
import Header from "../components/header"
import Lolly from '../components/Lolly'

export default function Home() {

  return (
    <div className="container" >
      <Header />

      <div className="listLollies" >

        <Lolly fillLollyTop="#d52358" fillLollyMiddle="#e95946" fillLollyBottom="#deaa43" />
        <Lolly fillLollyTop="red" fillLollyMiddle="blue" fillLollyBottom="green" />
        <Lolly fillLollyTop="#d52358" fillLollyMiddle="#e95946" fillLollyBottom="#deaa43" />
        <Lolly fillLollyTop="red" fillLollyMiddle="blue" fillLollyBottom="green" />


      </div>

      <button onClick={() => {
        console.log("create new lolly")
        navigate("/createNew")

      }} >
        Make a new Lolly to send a Friend
    </button>

    </div>)
}