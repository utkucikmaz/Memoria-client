import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddComment from "./AddComment";
import { ToastContainer, toast } from 'react-toastify';



export default function MemoryCard(props) {
    const [showComments, setShowComments] = useState(false);
    const [isClicked, setIsClicked] = useState(props.memory.favorite);
    let token = localStorage.getItem("authToken");
    const handleClick = () => {
        setIsClicked(!isClicked);
        onClickFavButton();
    };
    const toggleCommentsVisibility = () => {
        setShowComments(!showComments);
    };
    const onClickFavButton = () => {
        const requestBody = { favorite: !props.memory.favorite };
        axios
            .put(
                `${import.meta.env.VITE_API_URL}/api/events/${
                    props.memory._id
                }`,
                requestBody,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                props.onFavCallback();
            });
    };
    let createdDate = new Date(props.memory.createdAt);
    let timeDiff = Date.now() - createdDate;
    let friendlyTimeStamp;

    if (timeDiff > 864000000) {
        friendlyTimeStamp = `on ${props.memory.createdAt.slice(0, 10)}`;
    } else if (timeDiff > 172800000) {
        friendlyTimeStamp = `${Math.floor(timeDiff / 86400000)} days ago`;
    } else if (timeDiff > 86400000) {
        friendlyTimeStamp = `${Math.floor(timeDiff / 86400000)} day ago`;
    } else if (timeDiff > 7200000) {
        friendlyTimeStamp = `${Math.floor(timeDiff / 3600000)} hours ago`;
    } else if (timeDiff > 3600000) {
        friendlyTimeStamp = `${Math.floor(timeDiff / 3540000)} hour ago`;
    } else if (timeDiff > 120000) {
        friendlyTimeStamp = `${Math.floor(timeDiff / 60000)} minutes ago`;
    } else {
        friendlyTimeStamp = `just now`;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText('https://memoriapp.netlify.app/events/'+props.memory._id);
        notify();
    }

    const notify = () => toast('Link to Memory copied to clipboard', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });




    return (
        
        <div className="flex border p-5 m-5 rounded-xl shadow-lg">
            
            {props.memory && (
                <>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between p-5">
                            <div className="flex justify-between">
                                <a href={`/events/${props.memory._id}`}>
                                    <img
                                        src={props.memory.userId?.imageUrl}
                                        alt=""
                                        className="h-12 w-12 rounded-full border max-w-xs overflow-hidden"
                                    />
                                </a>

                                <span className="font-normal text-lg m-2">
                                    {props.memory.userId?.name}
                                </span>
                            </div>

                            <div>
                                <p className="timestamp text-right justify-self-end text-sm">
                                    {friendlyTimeStamp}
                                </p>
                            </div>
                        </div>
                        <p className="text-lg font-semibold">
                            {props.memory.title}
                        </p>
                        <p className="text-md font-normal text-left m-2">{props.memory.content}</p>
                        <img
                            src={props.memory.imageUrl}
                            alt=""
                            className="rounded-lg w-full self-center"
                        />
                        <br />
                        <div className=" flex pl-2 justify-end items-center">
                            {/* Font Awesome icons */}

                            <button onClick={toggleCommentsVisibility}>
                                <i
                                    className="far fa-comment"
                                    data-testid="comment-icon"
                                ></i>{" "}
                                {props.memory.comments.length}
                            </button>

                            <button
                                type="button"
                                id="FavTestId"
                                onClick={handleClick}
                                data-cy="FavTest"
                            >
                                {isClicked ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        fill="red"
                                        className="bi bi-heart-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        fill="red"
                                        className="bi bi-heart"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                    </svg>
                                )}
                            </button>
                            <button>
                            <i
                                className="fas fa-share"
                                data-testid="share-icon"
                                onClick={copyToClipboard}
                                
                            ></i>
                            </button>
                            
                            
                        </div>

                        {props.memory.comments.map((comment, index) => {
                            return (
                                <div key={index}>
                                    {showComments && (
                                        <>
                                            <hr className="border-t border-gray-300 w-full" />
                                            <div className="flex items-center w-full">
                                                <i
                                                    className="far fa-comment text-left"
                                                    data-testid="comment-icon"
                                                ></i>
                                                <span className="mx-auto">
                                                    {comment.text}
                                                </span>
                                                <p>{comment.owner}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                        <div>
                            <AddComment
                                infoEvent={props.memory}
                                members={props.members}
                                onFavCallback={props.onFavCallback}
                            />
                        </div>
                    </div>

                    <a href={`/events/${props.memory._id}`}>
                        <i className="fas fa-ellipsis-h"></i>
                    </a>
                </>
            )}
        </div>
    );
}
