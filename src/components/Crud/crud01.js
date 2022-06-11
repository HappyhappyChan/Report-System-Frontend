import {initData} from "@/api/data";
import Vue from 'vue'

/**
 * CRUD配置
 * @param {*} options <br>
 * @return crud instance.
 * @example
 * 要使用多crud时，请在关联crud的组件处使用crud-tag进行标记，如：<jobForm :job-status="dict.job_status" crud-tag="job" />
 */
function CRUD(options) {
    const data = {
        ...options,
        //每个CRUD实例都有一个tag，
        tag: 'default',
        loading: true,
        //表格数据
        tableData: [],
        page: {
            // 页码
            page: 1,
            // 每页数据条数
            size: 10,
            // 总数据条数
            total: 0
        },
        //查询参数，由混入组件提供
        params: {},
        //增删改查按钮
        optShow: {add: false, edit: false, delete: false, download: false},
        selectData: [],
    }

    //CRUD函数内部的this指的是crud实例
    const methods = {
        refresh() {
            this.loading = true
            // 请求数据
            let queryParams = {page: this.page.page - 1, size: this.page.size}
            initData(this.url, queryParams).then(data => {
                this.page.total = data.totalElements
                this.tableData = data.content
                this.loading = false
                callVmHook(crud, CRUD.HOOK.afterRefresh)
            }).catch(err => {
                this.loading = false
            })
        },
        // 预防删除当前页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
        dleChangePage() {
            if (this.tableData.length === 1 && this.page.page !== 1) {
                this.page.page -= 1
            }
        },
        // 每页条数改变
        sizeChangeHandler(size) {
            crud.page.size = size
            crud.page.page = 1
            crud.refresh()
        },
        // 当前页改变
        pageChangeHandler(page) {
            crud.page.page = page
            crud.refresh()
        },
        // 扩展crud的数据
        updateProp(name, value) {
            Vue.set(crud.props, name, value)
        },
        //点击新增、编辑、删除按钮时
        updateOperation(op) {
            callVmHook(crud, CRUD.HOOK.updateOperation, op)
        }
    }

    const crud = Object.assign({}, data)

    // 可观测化，意思是让crud变为响应式的对象，响应式的意思就是vue组件会根据对象里面值的变化而重新渲染组件
    Vue.observable(crud)
    // 附加方法
    Object.assign(crud, methods)
    // 附加vm相关方法
    Object.assign(crud, {
        // 预留4位存储：组件 主页、头部、分页、表单，调试查看也方便找
        vms: Array(4),
        /**
         * 注册组件实例
         * @param {String} type 类型
         * @param {*} vm 组件实例
         * @param {Number} index 该参数内部使用
         */
        registerVM(type, vm, index = -1) {
            const vmObj = {
                type,
                vm: vm
            }
            if (index < 0) {
                this.vms.push(vmObj)
                return
            }
            if (index < 4) { // 内置预留vm数
                this.vms[index] = vmObj
                return
            }
            this.vms.length = Math.max(this.vms.length, index)
            this.vms.splice(index, 1, vmObj)
        },
        /**
         * 取消注册组件实例
         * @param {*} vm 组件实例
         */
        unregisterVM(vm) {
            for (let i = this.vms.length - 1; i >= 0; i--) {
                if (this.vms[i] === undefined) {
                    continue
                }
                if (this.vms[i].vm === vm) {
                    if (i < 4) { // 内置预留vm数
                        this.vms[i] = undefined
                    } else {
                        this.vms.splice(i, 1)
                    }
                    break
                }
            }
        }
    })
    // 冻结处理，需要扩展数据的话，使用crud.updateProp(name, value)，以crud.props.name形式访问，这个是响应式的，可以做数据绑定
    Object.freeze(crud)
    return crud
}

// 通过这个方法调用CURD定义的钩子函数
function callVmHook(crud, hook) {
    let ret = true
    // 有些组件扮演了多个角色，调用钩子时，需要去重，指的是当一个组件混入presenter(), header(), form(), crud()其中的两个以上时，就会出现重复注册
    const vmSet = new Set()
    const nargs = [crud]
    for (let i = 2; i < arguments.length; ++i) {
        nargs.push(arguments[i])
    }
    crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
    console.log('vm数量', crud.vms)
    console.log('vm具体', crud.vms.map(vm => {
        return vm.vm.$el
    }))
    vmSet.forEach(vm => {
        if (vm[hook]) {
            ret = vm[hook].apply(vm, nargs) !== false && ret
        }
    })
    return ret
}

/**
 * CRUD钩子
 */
CRUD.HOOK = {
    /** 刷新 - 之后 */
    afterRefresh: 'afterCrudRefresh',
    /** "新建/编辑" 验证 - 之后 */
    afterValidateCU: 'afterCrudValidateCU',
    /** "点击增删改查按钮"  - 之后 */
    updateOperation: 'updateOperation'
}

/**
 * crud主页
 * 要把presenter理解成可被混入的组件
 * 原来通过传入crud进行赋值的模式保留，新增通过this.$options.cruds的方式进行crud的传入
 */
function presenter(crud) {
    return {
        data() {
            // 在data中返回crud，是为了将crud与当前实例关联，组件观测crud相关属性变化
            return {
                crud: this.crud
            }
        },
        beforeCreate() {//为了方便理解，这里增加一个vue组件的钩子函数，用来做crud的传入
            if (crud) {
                this.crud = crud
                this.crud.registerVM('presenter', this, 0)
                return
            }
            this.$crud = this.$crud || {}
            let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud
            if (!(cruds instanceof Array)) {
                cruds = [cruds]
            }
            // 目前即使是原项目也没出现一个页面使用多个crud的情况，所以这段代码其实改为直接注册presenter组件即可
            cruds.forEach(ele => {
                if (this.$crud[ele.tag]) {
                    console.error('[CRUD error]: ' + 'ele with tag [' + ele.tag + ' is already exist')
                }
                this.$crud[ele.tag] = ele
                ele.registerVM('presenter', this, 0)
            })
            this.crud = this.$crud['defalut'] || cruds[0]
            console.log(this.crud)
        },
        created() {
            //有这句代码，用户组件和角色组件的created方法就不用再分别调用refresh了。
            this.crud.refresh()
        },
        destroyed() {
            this.crud.unregisterVM(this)
        }
    }
}

/**
 * crud，用来给提取出来的独立组件提供混入的方法
 */
function crud(options = {}) {
    const defaultOptions = {
        type: undefined
    }
    options = mergeOptions(defaultOptions, options)
    return {
        data() {
            return {
                crud: this.crud
            }
        },
        beforeCreate() {
            this.crud = lookupCrud(this)
            this.crud.registerVM(options.type, this)
        },
        destroyed() {
            this.crud.unregisterVM(options.type, this)
        }
    }
}

function mergeOptions(src, opts) {
    const optsRet = {
        ...src
    }
    for (const key in src) {
        if (opts.hasOwnProperty(key)) {
            optsRet[key] = opts[key]
        }
    }
    return optsRet
}

/**
 * 查找crud
 * 如果使用组件的时候有传crud-tag标签，则创建独立的crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
    tag = tag || vm.$attrs['crud-tag'] || 'default'
    //$crud在presenter中定义
    if (vm.$crud) {
        const ret = vm.$crud[tag]
        if (ret) {
            return ret
        }
    } else
        //如果vm.$crud不存在，则寻找父组件的$crud
        return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined
}

/**
 * 头部
 */
function header() {
return {
    data() {
    return {
        crud: this.crud,
        query: this.crud.query
    }
    },
    beforeCreate() {
    this.crud = lookupCrud(this)
    this.crud.registerVM('header', this, 1)
    },
    destroyed() {
    this.crud.unregisterVM('header', this)
    }
}
}

/**
 * 表单
*/
function form(defaultForm) {
return {
    data() {
    return {
        crud: this.crud,
        form: this.crud.form
    }
    },
    beforeCreate() {
    this.crud = lookupCrud(this)
    this.crud.registerVM('form', this, 3)
    },
    created() {
    this.crud.defaultForm = defaultForm
    this.crud.resetForm()
    },
    destroyed() {
    this.crud.unregisterVM('form', this)
    }
}
}

/**
 * 分页
 */
function pagination() {
    return {
      data() {
        return {
          crud: this.crud,
          page: this.crud.page
        }
      },
      beforeCreate() {
        this.crud = lookupCrud(this)
        this.crud.registerVM('pagination', this, 2)
      },
      destroyed() {
        this.crud.unregisterVM('pagination', this)
      }
    }
}

export default CRUD

export {presenter, crud, header, form, pagination}
