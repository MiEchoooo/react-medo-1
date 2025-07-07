import avatar from './images/wuxidixi.jpg'
// import linavatar from './images/lin.jpg'
// import zhouavatar from './images/zhou.jpg'
// import xueavatar from './images/xue.jpg'

import './App.css'
import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { v4 as uuidV4} from 'uuid'
import dayjs from 'dayjs'
import axios from 'axios'


// // 评论列表数据
// const defaultList = [
//   {
//     rpid: 1,
//     user : {
//       uid: '123456',
//       avatar: linavatar,
//       uname: '林俊杰'
//     },
//     content: '落叶的位置，谱出一首诗',
//     ctime: '2025/07/04 19:20',
//     like: 506,
//   },
//   {
//     rpid: 2,
//     user : {
//       uid: '020202',
//       avatar: zhouavatar,
//       uname: '周杰伦'
//     },
//     content: '还记得你说家是唯一的城堡',
//     ctime: '2023/02/08 9:50',
//     like: 494 
//   },
//   {
//     rpid: 3,
//     user : {
//       uid: '111111',
//       avatar: xueavatar,
//       uname: '薛之谦'
//     },
//     content: '我口袋只剩玫瑰一片',
//     ctime: '2020/07/17 15:21',
//     like: 717,
//   },
//   {
//     rpid: 4,
//     user : {
//       uid: '2023214404',
//       avatar: avatar,
//       uname: '米姝萱'
//     },
//     content: '删掉我',
//     ctime: '2023/12/19 18:20',
//     like: 156,
//   },
// ]

// 当前登录用户信息
const user = {
  uid: '2023214404',
  avatar,
  uname: 'msx',
}

// 导航Tab数组
const tabs = [
  {type: 'time', text: '最新'},
  {type: 'hot', text: '最热'}
]

// 封装请求数据的hook
function useGetList() {
  // 获取接口数据渲染
  const [comment, setComment] = useState([]);

  useEffect(() => {
    // 请求数据
    async function getList() {
      // axios请求数据
      const res = await axios.get('http://localhost:3004/list')
      setComment(res.data);
    }
    getList()
  }, [])
  
  return {
    comment,
    setComment
  }
}

// 封装评论项
function Item ({item, onDel }) {
  return (<div className="reply-list">
            <div className="reply-item">
              <div className="root-reply-avatar">
                <div className="bili-avatar">
                  <img
                    className="bili-avatar-img"
                    alt=""
                    src={item.user.avatar}
                  />
                </div>
              </div>

              <div className="content-wrap">
                <div className="user-info">
                  <div className="user-name">{item.user.uname}</div>
                </div>
                <div className="root-reply">
                  <span className="reply-content">{item.content}</span>
                  <div className="reply-info">
                    <span className="reply-time">{item.ctime}</span>
                    <span className="reply-time">点赞数:{item.like}</span>
                    {/* 当前用户自己发布的评论 -> 显示删除选项 */}
                    {user.uid === item.user.uid &&
                    // 点击后传出一个参数 item.rpid 
                    // 拿到当前评论的rpid
                    <span className="delete-btn" onClick={() => handleDel(item.rpid)}>  
                      删除
                    </span>}
                  </div>
                </div>
              </div>
            </div>
          </div>)
}


const App = () => {
  // // 使用useState维护defaultList 评论列表内容
  // const [comment, setComment] = useState(defaultList);

  const {comment, setComment} = useGetList()

  // 使用useState维护Tab
  const [type, setType] = useState('hot')
  // 使用useState维护content 发布评论内容
  const [content, setContent] = useState('')

  // 绑定dom元素
  const inputRef = useRef(null)

  // 点击删除功能
  const handleDel = (id) =>{
    console.log(id)
    // 传入通过点击拿到的rpid
    // 使用setComment 只替换不修改
    setComment(comment.filter(item => item.rpid !== id)) // 只保留没被删除的id
  }
  // Tab 切换
  const handleTabChange = (type) => {
    console.log(type)
    setType(type)
    // 基于列表排序功能
    {
      if (type === 'hot') {
        // 根据点赞数排序
        // 传入一个排序好的新数据 ———— 只替换不修改
        setComment(_.orderBy(comment, 'like', 'desc'))
      }
      else {
        // 根据发布时间排序
        setComment(_.orderBy(comment, 'ctime', 'desc'))
      }
    }
  }

  // 发表评论
  const handlePublish = () => {
    setComment ([
      ...comment,
      { 
        // 需要一个唯一的随机数id
        rpid: uuidV4(),
        user : {
          uid: '2023214404',
          avatar: avatar,
          uname: '米姝萱'
        },
        content: content,
        // 以当前时间为准
        ctime: dayjs(new Date()).format('YYYY/MM/DD HH:mm'),
        like: 0,
      },
    ])
    // 清空输入框内容
    setContent("") 

    // 重新聚焦
    inputRef.current.focus()
  }


  return (
    <div className="app">
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">评论</span>
            <span className="total-reply">{10}</span> 
          </li>
          <li className="nav-sort">
            {/*  高亮类名：active */}
            {tabs.map(item => (
              <span key={item.type} 
              onClick={() => handleTabChange(item.type)} 
              className={`nav-item ${type === item.type && 'active'}`}>
                {item.text}
              </span>
            )) }   
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        <div className="box-normal">
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={avatar} alt="用户头像" />
            </div>
          </div>
          <div className="reply-box-wrap">
            <textarea
              className="reply-box-textarea"
              placeholder="发一条友善的评论"
              ref={inputRef}
              value={content}
              onChange = {(e) => setContent(e.target.value)}
            />
            <div className="reply-box-send">
              <div 
              className="send-text"
              onClick={handlePublish}
              >
                发布
              </div>
            </div>
          </div>
        </div>
        {/* 遍历每一条评论 */}
        {comment.map(item => ( <Item key={item.rpid} item={item} onDel={handleDel} />) )}
      </div>
    </div>
    
  )
}

export default App 