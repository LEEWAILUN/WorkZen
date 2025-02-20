import React, { Component, createRef, ChangeEvent } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import './chat.css';

interface ChatMessage {
  sender: 'user' | 'assistant';
  content: string;
}

interface TableData {
  name: string;
  headers: string[];
  data: { level: number; cells: string[]; expanded: boolean }[];
}

interface ChatSuggestionProps {
  selectedTable: TableData | null;
}

interface ChatSuggestionState {
  conversation: ChatMessage[];
  userInput: string;
}

class ChatSuggestion extends Component<ChatSuggestionProps, ChatSuggestionState> {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: ChatSuggestionProps) {
    super(props);
    this.state = {
      conversation: [],
      userInput: '',
    };
    this.messagesEndRef = createRef();
    this.textAreaRef = createRef();
  }

  componentDidUpdate(prevProps: ChatSuggestionProps) {
    if (prevProps.selectedTable !== this.props.selectedTable) {
      this.setState({ conversation: [] }); // Reset chat when table changes
    }

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

  formatTableData = (table: TableData | null): string => {
    if (!table) return "No table data available.";
    
    let formattedTable = `Table: ${table.name}\n`;
    formattedTable += `Columns: ${table.headers.join(", ")}\n`;
    formattedTable += "Rows:\n";

    table.data.forEach((row, index) => {
      formattedTable += `  Row ${index + 1}: ${row.cells.join(" | ")}\n`;
    });

    return formattedTable;
  };

  sendMessage = () => {
    const { userInput, conversation } = this.state;
    const { selectedTable } = this.props;

    if (!userInput.trim()) return;

    const updatedConversation = [
      ...conversation,
      { sender: 'user', content: userInput },
    ];

    this.setState({ conversation: updatedConversation, userInput: '' }, () => {
      this.adjustTextareaHeight();
      
      const tableContext = this.formatTableData(selectedTable);

      const requestData = {
        messages: [
          { role: 'system', content: "You are an AI assistant analyzing table data." },
          { role: 'user', content: `Here is my table:\n${tableContext}` },
          { role: 'user', content: userInput },
        ],
        web_access: false,
      };

      const options = {
        method: 'POST',
        url: 'https://chatgpt-42.p.rapidapi.com/o3mini',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'fc9d1a72femsh695f99ca287f344p1b5ae4jsn7fbbc0bafce8',
          'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
        },
        data: requestData
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

  render() {
    const { userInput, conversation } = this.state;
    const { selectedTable } = this.props;

    return (
      <div className="chat-container">
        <h3>Chat Assistant</h3>
        {selectedTable && <p>Analyzing: {selectedTable.name}</p>}
        
        <div className="chat-messages">
          {conversation.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                {msg.content.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <div ref={this.messagesEndRef} />
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
      </div>
    );
  }
}

export default ChatSuggestion;