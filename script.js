console.log('hello, world')

class DataService {
  _dataUrl = 'data.json'

  getResource = async () => {
    const res = await fetch(`${this._dataUrl}`)
    if (!res.ok) {
      throw new Error (`Could not fetch, received ${res.status}`)
    }
    const body = await res.json()
    return body
  }

  getData = async () => {
    const res = await this.getResource()
    return res
  }
}

const dataService = new DataService ()

const createTrElement = function (item, className, openBtn = null) {

  const itemElement = document.createElement('tr')
  itemElement.className = className

  const openBtnElement = document.createElement('td')
  if (openBtn) {
    openBtnElement.appendChild(openBtn)
  }
  itemElement.appendChild(openBtnElement)

  const parentId = document.createElement('td')
  parentId.innerHTML = item.parentId
  itemElement.appendChild(parentId)

  const id = document.createElement('td')
  id.innerHTML = item.id
  itemElement.appendChild(id)

  const name = document.createElement('td')
  name.innerHTML = item.name
  itemElement.appendChild(name)

  const email = document.createElement('td')
  email.innerHTML = item.email
  itemElement.appendChild(email)

  const balance = document.createElement('td')
  balance.innerHTML = item.balance
  itemElement.appendChild(balance)

  const isActive = document.createElement('td')
  isActive.innerHTML = item.isActive
  itemElement.appendChild(isActive)


  return itemElement
}


const firstSort = function (funcData) {
  const result = []
  if (funcData) {
    funcData.map((item) => {
      funcData.map((subitem) => {
        if (subitem.parentId === item.id) {
          result.push(subitem)
        }
      })
    })
  }
  if (result.length > 0) {
    return result
  } else {
    return null
  }
}

const newData = [[], []]
dataService.getData()
  .then((data) => {
    data.map(item => {
      if (item.parentId === 0) {
        newData[0].push(item)
      } else {
        newData[1].push(item)
      }
    })
    let idx = 1
    while (newData[idx]) {
      newData[idx + 1] = firstSort(newData[idx])
      idx++
    }
    let newIdx = 0
    while (newData[newIdx + 1]) {
      const secondFilteredItems = []
      newData[newIdx].map(item => {
        item.hasChild = false
        item.childs = []
        newData[newIdx + 1].map(childitem => {
          if (childitem.parentId === item.id) {
            item.hasChild = true
            item.childs.push(childitem)
            secondFilteredItems.push(childitem)
          }
        })
      })
      newData[newIdx + 1] = secondFilteredItems
      newIdx++
    }

    const draw = function (item) {
      let className = ''
      if (item.isActive) {
        className += ' isActiveTrue'
      } else {
        className += ' isActiveFalse'
      }
      let openBtn
      if (item.hasChild) {
        className += ` parent${item.id}`
        openBtn = document.createElement('button')
        openBtn.innerHTML = 'Open childs'
        openBtn.onclick = function () {
          const childs = document.getElementsByClassName(`child${item.id}`)
          for (child of childs) {
            child.classList.toggle('opened')
          }
        }
      }
      if (item.parentId !== 0) {
        className += ` child child${item.parentId}`
      }
      const newElement = createTrElement(item, className, openBtn)
      document.querySelector('#root').appendChild(newElement)
      if (item.hasChild) {
        item.childs.map(subitem => {
          draw(subitem)
        })
      }
    }
    newData[0].map(item => {
      draw(item)
    })
  })

document.querySelector('#onlyActive').onclick = function () {
  const items = document.getElementsByClassName('isActiveFalse')
  for (item of items) {
    item.classList.toggle('isActiveFalseClosed')
  }
}
document.querySelector('#onlyNoActive').onclick = function () {
  const items = document.getElementsByClassName('isActiveTrue')
  for (item of items) {
    item.classList.toggle('isActiveTrueClosed')
  }
}
