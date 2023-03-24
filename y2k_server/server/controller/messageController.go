// package controller

// import (
// 	"log"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// 	"github.com/jxsr12/oldegg/graph/model"
// 	websocket "github.com/jxsr12/oldegg/websocket"
// 	ws "github.com/jxsr12/oldegg/websocket"
// )

// func ServeWebsocket(pool *ws.Pool) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		id, _ := toUint(r.URL.Query().Get("id"))
// 		user_id, _ := toUint(r.URL.Query().Get("user"))

// 		conn, err := websocket.Upgrade(w, r, nil)

// 		if err != nil {
// 			log.Println(err)
// 			return
// 		}

// 		client := &ws.Client{
// 			Conn:   conn,
// 			Pool:   pool,
// 			ChatID: id,
// 			UserID: user_id,
// 		}

// 		pool.Register <- client
// 		client.Read()
// 		// go websocket.Writer(conn)
// 		// websocket.Reader(conn)
// 	}
// }

// func GetChatRooms(w http.ResponseWriter, r *http.Request) {
// 	id := getUserID(r.Context())
// 	chats := model.GetRooms(id)

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]interface{}{
// 		"message": "success",
// 		"chats":   chats,
// 	})
// }

// // still error
// func CreateNewChat(w http.ResponseWriter, r *http.Request) {
// 	var users []model.User
// 	id := getUserID(r.Context())
// 	if id == "" {
// 		return
// 	}
// 	id2 := r.URL.Query().Get("id")

// 	if id == "" || id2 == "" {
// 		abortError(w, http.StatusBadRequest, "Bad Request")
// 		return
// 	}

// 	chats := model.GetRooms(id)
// 	count := 0

// 	user := model.GetUserById(id)
// 	user2 := model.GetUserById(id2)
// 	var tmp model.Chat
// 	for _, c := range chats {
// 		if len(c.Users) > 2 {
// 			continue
// 		}
// 		count = 0
// 		for _, u := range c.Users {
// 			if u.ID == user.ID || u.ID == user2.ID {
// 				count = count + 1
// 				break
// 			}
// 		}

// 		if count >= 2 {
// 			tmp = c
// 			break
// 		}
// 	}

// 	if count >= 2 {
// 		// abortError(w, http.StatusBadRequest, "Chat is created")
// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusOK)
// 		json.NewEncoder(w).Encode(map[string]interface{}{
// 			"message": "chat already created..",
// 			"tmp":     tmp,
// 		})
// 		return
// 	}

// 	users = append(users, user)
// 	users = append(users, model.GetUserById(id2))
// 	// fmt.Println(users)
// 	chat, err := model.CreateRoom(users)

// 	if err != nil {
// 		abortError(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]interface{}{
// 		"message": "success",
// 		"chat":    chat,
// 	})
// }

// func AddMessage(w http.ResponseWriter, r *http.Request) {
// 	id := getUserID(r.Context())
// 	var message model.Message
// 	json.NewDecoder(r.Body).Decode(&message)

// 	model.CreateMessage(message.ChatID, id, &message)

// 	// if err != nil {
// 	// 	abortError(w, http.StatusInternalServerError, err.Error())
// 	// 	return
// 	// }

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]interface{}{
// 		"message":      "success",
// 		"chat_message": message,
// 	})
// }

// func GetMessageByChat(c *gin.Context) {
// 	chat_id, _ := toUint(c.Query("id"))
// 	chat := model.GetRoomById(chat_id)

// 	messages := model.GetMessage(&chat)

// 	c.JSON(200, gin.H{
// 		"message":  "success",
// 		"messages": messages,
// 	})
// }

// func SendPost(c *gin.Context) {
// 	id := getUserID(c)
// 	post_id := c.Query("post_id")
// 	user_id := c.Query("user_id")

// 	message := model.CreateSendPost(id, user_id, post_id)
// 	c.JSON(200, gin.H{
// 		"message": "success",
// 		"data":    message,
// 	})
// }
// func SendProfile(c *gin.Context) {
// 	id := getUserID(c)
// 	profile_id, _ := toUint(c.Query("profile_id"))
// 	user_id := c.Query("user_id")

// 	message := model.CreateSendProfile(id, user_id, profile_id)

// 	c.JSON(200, gin.H{
// 		"message": "success",
// 		"data":    message,
// 	})

// }

// func SendImage(c *gin.Context) {
// 	chat_id, _ := toUint(c.Query("chat_id"))
// 	id := getUserID(c)
// 	var message model.Message
// 	c.BindJSON(&message)
// 	model.CreateMessage(chat_id, id, &message)

// }