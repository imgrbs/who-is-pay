import React from 'react'
import styled, {injectGlobal} from 'styled-components'
import SweetAlert from 'sweetalert-react'
import './static/materialize.min.css'
import './static/sweetalert.min.css'

const Container = styled.div`
  min-height: 95vh;
`

const Input = styled.input`

`

const Button = styled.button`

`

const ClearButton = styled.button`

`

const List = styled.ul`
  overflow-y: scroll;
  height: 55vh;
`

class App extends React.Component {
  state = {
    value: '',
    name: '',
    list: [],
    backupList: [],
    sum : 0,
    show: false,
    action: ''
  }

  _toggleModal = (action) => {
    this.setState({
      action,
      show: !this.state.show
    })
  }

  _handleChange = (field, e) => {
    this.setState({
      [field]: e.target.value
    })
  }

  _addList = async (e) => {
    const {value, name, list} = this.state
    if (!(value === '' || name === '')) {
      e.preventDefault()
      const newObj = {name, value}
      const newList = [...list]
      await newList.push(newObj)
      this.setState({
        list: newList,
        value: '',
        name: ''
      })
      localStorage.setItem('list', JSON.stringify(newList))
      this._sum()
    }
  }

  _delControl = (action, key) => {
    this.state.action === 'key' ? this._deleted(key) : this._clearList()
    this._toggleModal()
  }
  
  _deleted = async key => {
    const {list} = this.state
    const newList = list
    newList.splice(key, 1)
    this.setState({
      list: newList
    })
    localStorage.setItem('backupList', JSON.stringify(list))
    localStorage.setItem('list', JSON.stringify(newList))
    this._sum()
  }
  
  _clearList = () => {
    this.setState({
      list: [],
      backupList: this.state.list
    })
    localStorage.removeItem('list')
    localStorage.setItem('backupList', JSON.stringify(this.state.list))
  }

  _sum = async () => {
    let {value} = await this.state.list.reduce((a, b) => {
      return {
        value: +a.value + +b.value
      }
    }, {value: 0})
    this.setState({
      sum: value
    })
  }
  
  async componentWillMount () {
    await injectGlobal`
      .collection-item .row {
        margin-bottom: 0;
      }
    `
  }

  async componentDidMount () {
    const list = await JSON.parse(localStorage.getItem('list'))
    if (list) {
      this.setState({ list })
    }
    this._sum()
  }
  
  render() {
    return (
      <Container className='container'>
        <div className='row'>
          <div className="col s6">
            <h4>
              พรรคเถอะ
            </h4>
          </div>
          <div className="col s6">
            <h5 style={{textAlign: 'right'}}>
              ยอดทั้งหมด <br />
              <b>
                {
                  this.state.sum
                }
              </b>
            </h5>
          </div>
          <div className='col s12'>
            <form action="/">
              <Input value={this.state.name} onChange={e => this._handleChange('name', e)} type='text' className='input-field' placeholder='ใครจ่าย ?' required/>
              <Input value={this.state.value} onChange={e => this._handleChange('value', e)} type='number' className='input-field' placeholder='จ่ายเท่าไหร่' required/>
              <Button onClick={this._addList} type='submit' className='col s12 waves-effect blue accent-2 btn'>เพิ่ม</Button>
            </form>
          </div>
          <div className="col s12">
            <List className="collection">
              <li className='collection-item'>
                <div className="row">
                  <div className="col s5">
                    ชื่อคนจ่าย
                  </div>
                  <div className="col s5">
                    <b>จ่ายเท่าไหร่</b>
                  </div>
                </div>
              </li>
              {
                this.state.list.reverse().map((data, i) =>
                <li key={i} className="collection-item">
                  <div className="row">
                    <div className="col s5">
                      {data.name}
                    </div>
                    <div className="col s5">
                      <b>{data.value}</b>
                    </div>
                    <div className="col s2">
                      <Button onClick={() => this._toggleModal('key')} className='red darken-4 btn'>x</Button>
                    </div>
                  </div>
                </li>)
              }
            </List>
          <ClearButton onClick={() => this._toggleModal('clear')} type='submit' className='col s12 waves-effect red darken-4 btn'>ลบทั้งหมด</ClearButton>
          </div>
        </div>
        <SweetAlert
          showCancelButton
          show={this.state.show}
          title="ใจเย็นๆ คิดดีๆ"
          text="จะลบจริงหรอ ?"
          onConfirm={this._delControl}
          onCancel={this._toggleModal}
        />
      </Container>
    );
  }
}

export default App;
