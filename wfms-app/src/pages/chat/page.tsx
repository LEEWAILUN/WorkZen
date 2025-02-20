import React, { Component, createRef, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import axios from 'axios';
import './chat.css';
import Drawer from '../../components/navigation/drawer/navigation';
import Sidebar from '../../components/navigation/sidebar/navigation';
import Dashboard from '../dashboard/page';

interface ChatMessage {
  sender: 'user' | 'assistant';
  content: string;
}

interface TableData {
  name: string;
  headers: string[];
  data: string[][];
}

interface DashboardData {
  dashboardName: string;
  tables: TableData[];
}

interface ChatSuggestionState {
  conversation: ChatMessage[];
  userInput: string;
  drawerOpen: boolean;
  dashboardData: DashboardData | null;
}

class ChatSuggestion extends Component<{}, ChatSuggestionState> {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      conversation: [],
      userInput: '',
      drawerOpen: false,
      dashboardData: null,
    };
    this.messagesEndRef = createRef();
    this.textAreaRef = createRef();
  }

  componentDidUpdate() {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  adjustTextareaHeight = () => {
    if (this.textAreaRef.current) {
      this.textAreaRef.current.style.height = '40px'; 
      this.textAreaRef.current.style.height = `${this.textAreaRef.current.scrollHeight}px`;
    }
  };

  handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ userInput: e.target.value }, this.adjustTextareaHeight);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  };

  sendMessage = () => {
    const { userInput, conversation } = this.state;
    if (!userInput.trim()) return;

    const updatedConversation = [
      ...conversation,
      { sender: 'user', content: userInput },
    ];
    this.setState({ conversation: updatedConversation, userInput: '' }, () => {
      this.adjustTextareaHeight(); // Reset input height after sending

      const options = {
        method: 'POST',
        url: 'https://chatgpt-42.p.rapidapi.com/o3mini',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'fc9d1a72femsh695f99ca287f344p1b5ae4jsn7fbbc0bafce8',
          'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
        },
        data: {
          messages: [{ role: 'user', content: userInput }],
          web_access: false,
        }
      };

      axios.request(options)
        .then(response => {
          this.setState(prevState => ({
            conversation: [
              ...prevState.conversation,
              { sender: 'assistant', content: response.data.result },
            ],
          }));
        })
        .catch(error => console.error(error));
    });
  };
  

  renderChat() {
    const { drawerOpen, userInput, conversation } = this.state;
    return (
      <div className="chat-container">
        <div className="chat-messages">
          {conversation.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                {msg.content ? (
                  msg.content.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                ) : (
                  <span className="error-text">[Message content missing]</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-container">
          <textarea
            ref={this.textAreaRef}
            className="chat-input"
            placeholder="Type your message..."
            value={userInput}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            rows={1}
          />
          <Button color="primary" onClick={this.sendMessage} className="send-button">
            Send
          </Button>
        </div>

        <Drawer open={drawerOpen} toggleDrawer={() => this.setState({ drawerOpen: !drawerOpen })} title="Conversation History">
          <p>You can review previous messages here.</p>
        </Drawer>
        <Button color="secondary" onClick={() => this.setState({ drawerOpen: !drawerOpen })} className="toggle-drawer-btn">
          {drawerOpen ? "Close History" : "Open History"}
        </Button>
      </div>
    );
  }

  render() {
    const { dashboardData } = this.state;
    return (
      <div className="app-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        {dashboardData ? (
          <Dashboard initialData={dashboardData} />
        ) : (
          this.renderChat()
        )}
      </div>
    );
  }
}

export default ChatSuggestion;

if (document.getElementById('example')) {
  ReactDOM.render(<ChatSuggestion />, document.getElementById('example'));
}
