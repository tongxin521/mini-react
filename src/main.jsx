import ReactDOM from './lib/react-dom/ReactDom'
import AppFunction from './AppFunction.jsx'
import AppClass from './AppClass.jsx'
import TodoList from './TodoList.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(<AppFunction />)

// root.render(<AppClass />)

// root.render(11111);

// function test() {}
// root.render(
//     <div id="oDiv" className="test" onChange={test}>
//       <ul>
//         <li>苹果</li>
//         <li>香蕉</li>
//         <li>西瓜</li>
//       </ul>
//       1111
//     </div>
//   );

root.render(<TodoList />);
