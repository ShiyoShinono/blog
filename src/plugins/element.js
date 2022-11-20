import Vue from 'vue';
import {
  Message,
  MessageBox,
  Button,
  Input,
  Icon,
  Form,
  FormItem,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Tag,
  Table,
  TableColumn,
  Switch,
  Upload,
  Tooltip,
  Row,
  Card,
  Col,
  DatePicker,
  Select,
  Option
} from 'element-ui'
// 按需引入
Vue.use(Button)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Tooltip)
Vue.use(Row)
Vue.use(Card)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert