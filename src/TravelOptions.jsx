import React, { useState } from 'react';

//import { Card, CardContent } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
//import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import "./styles/ui.css"; // Import CSS
import "./styles/bootstrap.css";
//import  ValentineSelection  from "./ValentineSelection";


const TravelOptions = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showData, setShowData] = useState(false);
  const [currentuser, setCurrentuser] = useState("");
  

  const [selectedOptions, setSelectedOptions] = useState({
    florists : null,
    restaurants : null,
    hotels : null,
  });

  const handleSelection = (category, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: prev[category] === option ? null : option,
    }));
  };

  const users = [
    { lname: "Jean", fname: "Picard", profile: "Ultra-Rich", preferences: "[Indian Food, Persian Food]", airlineClass: "Business Class", hotelRating: "4,5" },
    { lname: "James", fname: "Kirk", profile: "Mass Affluent", preferences: "[American Food, Sushi Food]", airlineClass: "Economy", hotelRating: "3,4" },
    { lname: "Kathryn", fname: "Janeway", profile: "Student", preferences: "[Mexican Food, Chinese Food]", airlineClass: "Economy", hotelRating: "2,3" }
  ];

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '25px',
    overflow: 'hidden',
    border: '1px solid #ccc',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    gap: '20px',
    padding: '20px',
    fontSize: 0.5 + 'em',
    fontFamily: 'Georgia, serif',
  };

  const inputStyle = {
    border: 'none',
    //padding: '10px 15px',
    fontSize: '1rem',
    flexGrow: '1',
    borderRadius: '25px 0 0 25px',
    outline: 'none',
    fontFamily:'emoji',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    fontSize: '1rem',
    borderRadius: '0 25px 25px 0',
    cursor: 'pointer',
    outline: 'none',
  };


  const finalSelection = (data, selectionIdxArr) => {
    if(selectionIdxArr.florists==null && selectionIdxArr.restaurants==null && selectionIdxArr.hotels==null){
      alert('Please select the relevant options and click on book');
      return;
    }
    console.log(data.florists[selectionIdxArr.florists]);
    console.log(data.restaurants[selectionIdxArr.restaurants]);
    console.log(data.hotels[selectionIdxArr.hotels]);
    setShowData(false);
  };

  const clearSearchResults = () => {
    setData(null); // Set state to null to clear results
    setLoading(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    //setExtractedName(null);
    clearSearchResults();
    console.log(input);
    var firstName = '';
    const match = input.match(/\(([^)]+)\)/); // Extracts text inside ()
    if (match) {
      const fullName = match[1].trim(); // Extracted name inside ()
      const splitName = fullName.split(" "); // Split into words

      firstName = splitName.length > 0 ? splitName[0] : fullName; // Handle single-word names
      console.log("First word:", firstName); // Log first word
      setCurrentuser(firstName);
      //setExtractedName(firstName); // Store full extracted name
    } else {
      console.log("No name found in parentheses.");
      //setExtractedName("No name found.");
    }

    //setExtractedName(match ? match[1] : " ");
    console.log('>'+firstName+'<');

    //const splitWords = extractedName.toLocaleLowerCase().trim().split(" "); // Split by space

   // const foundUser = users.find(user => user.name.toLowerCase().includes(extractedName.toLowerCase()));

    const foundUser = users.find(user => 
      user.fname.toLowerCase().includes(firstName.toLowerCase()) || 
      user.lname.toLowerCase().includes(firstName.toLowerCase())
    );

    console.log(foundUser);

    const newMessage = { role: "user", content: input+' in in Palo Alto CA, Profile: '+foundUser.profile+', Preferences: '+foundUser.preferences+', Airline Fare Class: '+foundUser.airlineClass+', Hotel Star Rating: '+foundUser.hotelRating+ ' provide the options in JSON Array format with id, name, type, address, cuisine, rating, price with parent as valentine_date_options and categorize them as florists, restaurants, hotels and 3 resuts each with actual cost to book' };
    console.log("newMessage:", newMessage); 
    setMessages([newMessage]);
    setInput("");
    //setShowData(true);
    selectedOptions.florists=null;
    selectedOptions.restaurants=null;
    selectedOptions.hotels =null;

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Store in .env file
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: {"type": "json_object"}, // Properly included in body
          max_tokens:1000,
          messages: [ newMessage],
          temperature :0,
        }),
      });
      console.log('messages >> '+messages)
      const data1 = await response.json();
     
      const jsonResponse = JSON.parse(data1.choices[0].message.content);
      setData(jsonResponse.valentine_date_options);  // Store the relevant part of response 
      console.log(jsonResponse.valentine_date_options)
      setShowData(true);
    } catch (error) {
      console.error("Error fetching response: ", error);
    }
    setLoading(false);
  };

  return (
    <div className='search-results'>
      {data !=null && showData ? (
      <div className="card-deck" style={{flexFlow:'column'}}>
          <div className="custom-class">
          <h3  style={{color: 'red', fontSize: 1 + 'em', textAlign:'center'}} >{currentuser}, Here are the Options to choose</h3>
          <p className="text-gray-500 mb-7" style={{fontSize: 0.65 + 'em', textAlign:'center'}}>Please select the relevant options and click on book</p>
          <div style={{display:'flex', flexDirection:'row'}}>
          {/* Florists */}
          <div className="card">
            <div><h3 className="card-title" style={{ textAlign:'center', fontSize:'0.9em', fontFamily:'math'}}>Florists</h3></div>
              <div className="card-block" style={containerStyle}>
                  {data?.florists?.map((spot, index) =>  (
                  <div key={index} className="custom-box"  onClick={() => handleSelection("florists", index)} >
                    <input type="checkbox" checked={selectedOptions.florists === index} readOnly className="mr-2" />
                    <a href={spot.website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{spot.name}</b></a>
                    <p><b>Type</b> : {spot.type}</p>
                    <p><b>Location</b> : {spot.address}</p>
                    <p><b>Rating</b> : {spot.rating}</p>
                    <p><b>Price</b> : {spot.price}</p>
                  </div>
                  ))}
              </div>
          </div>
            
          {/* Hotels */}
          <div className="card">
            <div><h3 className="card-title" style={{ textAlign:'center', fontSize:'0.9em', fontFamily:'math'}}>Hotels</h3></div>
            <div className="card-block" style={containerStyle}>
                {data?.hotels?.map((spot, index) =>  (
                <div key={index} className="custom-box"  onClick={() => handleSelection("hotels", index)} >
                  <input type="checkbox" checked={selectedOptions.hotels === index} readOnly className="mr-2" />
                  <a href={spot.website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{spot.name}</b></a>
                  <p><b>Type</b> : {spot.type}</p>
                  <p><b>Location</b> : {spot.address}</p>
                  <p><b>Rating</b> : {spot.rating}</p>
                  <p><b>Price</b> : {spot.price}</p>
                </div>
                ))}
            </div>
          </div>

          {/* Restaurants */}
          <div className="card">
            <div><h3 className="card-title" style={{ textAlign:'center', fontSize:'0.9em', fontFamily:'math'}}>Restaurants</h3></div>
            <div className="card-block" style={containerStyle}>
                {data?.restaurants?.map((spot, index) =>  (
                <div key={index} className="custom-box"  onClick={() => handleSelection("restaurants", index)} >
                  <input type="checkbox" checked={selectedOptions.restaurants === index} readOnly className="mr-2" />
                  <a href={spot.website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{spot.name}</b></a>
                  <p><b>Type</b> : {spot.type}</p>
                  <p><b>Location</b> : {spot.address}</p>
                  <p><b>Cuisine</b> : {spot?.cuisine}</p>
                  <p><b>Rating</b> : {spot.rating}</p>
                  <p><b>Price</b> : {spot.price}</p>
                </div>
                ))}
            </div>
          </div>
          </div>
          <div style={{ textAlign:'center', paddingTop:'15px'}} ><Button onClick={() => finalSelection(data, selectedOptions)}  children={"Book"} className="button" /> </div>
          </div>
        </div>
      ) : (
        selectedOptions && data ? (
        <div className='final-regn' >
          <div className="card-deck" style={{justifyContent:'space-evenly'}}>
          <div className="custom-class" style={containerStyle} >
          <h3  style={{color: 'red', fontSize: 1.75 + 'em', textAlign:'center'}} >{currentuser} - Please find your bookings for the trip</h3>
          <div className='card'  >
            {selectedOptions.florists !==null && selectedOptions.florists >-1 ? (
            <div className="custom-box" >
                <a href={data.florists[selectedOptions.florists].website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{data.florists[selectedOptions.florists].name}</b></a>
                <p><b>Type</b> : {data.florists[selectedOptions.florists].type}</p>
                <p><b>Location</b> : {data.florists[selectedOptions.florists].address}</p>
                <p><b>Rating</b> : {data.florists[selectedOptions.florists].rating}</p>
                <p><b>Price</b> : {data.florists[selectedOptions.florists].price}</p>
            </div>
            ) : null} 
            {selectedOptions.restaurants !==null && selectedOptions.restaurants>-1  ? (
            
            <div className="custom-box" >
              <a href={data.restaurants[selectedOptions.restaurants].website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{data.restaurants[selectedOptions.restaurants].name}</b></a>
              <p><b>Type</b> : {data.restaurants[selectedOptions.restaurants].type}</p>
              <p><b>Location</b> : {data.restaurants[selectedOptions.restaurants].address}</p>
              <p><b>Cuisine</b> : {data.restaurants[selectedOptions.restaurants]?.cuisine}</p>
              <p><b>Rating</b> : {data.restaurants[selectedOptions.restaurants].rating}</p>
              <p><b>Price</b> : {data.restaurants[selectedOptions.restaurants].price}</p>
            </div>
            ) : null} 
            {selectedOptions.hotels !== null &&selectedOptions.hotels >-1 ? (
            <div className="custom-box" >
              <a href={data.hotels[selectedOptions.hotels].website} className="font-medium"  style={{color: 'rgb(38, 33, 135)'}}><b>{data.hotels[selectedOptions.hotels].name}</b></a>
              <p><b>Type</b> : {data.hotels[selectedOptions.hotels].type}</p>
              <p><b>Location</b> : {data.hotels[selectedOptions.hotels].address}</p>
              <p><b>Rating</b> : {data.hotels[selectedOptions.hotels].rating}</p>
              <p><b>Price</b> : {data.hotels[selectedOptions.hotels].price}</p>
            </div>
            ) : null}
          </div>
          </div>
        </div>
        </div>
      ) : (
        <p></p>
      )
      )}

      {/**Actual Search chatbot */}
      <div style={{padding: '10px'}}>
      <div className='containerStyle' style={{ display: 'flex', width: '95vw', gap: '2px', verticalAlign:'center' }}> {/* Container inline styles */}
          <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." 
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} disabled={loading} style={inputStyle}/>
          <button onClick={sendMessage}  style={buttonStyle} children={"Search"} disabled={loading} className="button"></button>
      </div>
      </div>
  </div>
  );
};

export default TravelOptions;
