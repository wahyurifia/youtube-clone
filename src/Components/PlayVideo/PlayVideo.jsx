import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import save from '../../assets/save.png'
import share from '../../assets/share.png'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

    const { videoId } = useParams();

    const [apiData, setApiData] = useState([]);
    const [channelData, setChannelData] = useState([]);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async () => {
        try {
            // Fetching Videos Data
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
            // await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]))
            const response = await fetch(videoDetails_url);
            console.log("res", response);
            const res = await response.json();
            setApiData(res.items[0])
            console.log("check response", res)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchOtherData = async () => {
        // Fetching CHannel Data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData?.snippet?.channelId}&key=${API_KEY}`
        await fetch(channelData_url).then(res => res.json()).then(data => {
            console.log("ini data kontol", data);
            setChannelData(data.length != 0 ? data?.items[0] : [])
        })

        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=10&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data?.items))

    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId])

    useEffect(() => {
        if (apiData.length != 0) fetchOtherData();
    }, [apiData])


    return (
        <div className="play-video">
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <h3>{apiData ? apiData?.snippet?.title : ''}</h3>
            <div className="play-video-info">
                <p>{apiData ? value_converter(apiData?.statistics?.viewCount) : "16k"} Views &bull; {apiData ? moment(apiData?.snippet?.publishedAt).fromNow() : ''}</p>
                <div>
                    <span><img src={like} alt="" />{apiData ? value_converter(apiData?.statistics?.likeCount) : ""}</span>
                    <span><img src={dislike} alt="" /></span>
                    <span><img src={share} alt="" /></span>
                    <span><img src={save} alt="" /></span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData?.snippet?.thumbnails?.default?.url} alt="" />
                <div>
                    <p>{apiData ? apiData?.snippet?.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData?.statistics?.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{apiData ? apiData?.snippet?.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData?.statistics?.commentCount) : 102} Comment</h4>
                {commentData.map((item, index) => {
                    return (
                        <div key={index} className="comment">
                            <img src={item?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet?.topLevelComment?.snippet?.authorDisplayName}<span>{moment(item?.snippet?.topLevelComment?.snippet?.updatedAt).fromNow()}</span></h3>
                                <p>{item?.snippet?.topLevelComment?.snippet?.textOriginal}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{value_converter(item?.snippet?.topLevelComment?.snippet?.likeCount)}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default PlayVideo