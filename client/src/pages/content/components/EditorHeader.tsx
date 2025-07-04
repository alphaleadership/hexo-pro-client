import { DeleteOutlined, SettingOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Col, message, Popconfirm, Row } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import React, { useContext, useState } from "react"
import cs from 'classnames'
import IconPin from "@/assets/pin.svg"
import IconPinFill from "@/assets/pin-fill.svg"
import { useDispatch } from "react-redux"
import { GlobalContext } from "@/context"
import useLocale from "@/hooks/useLocale"
import useDeviceDetect from "@/hooks/useDeviceDetect"
import { openDesktopLink } from "@/utils/desktopUtils"
import IconLink from "@/assets/link.svg"
import IconLinkLight from "@/assets/linkLight.svg"

export default function EditorHeader({ initTitle, isPage, isDraft, popTitle, popDes, className = '', permalink = undefined, handleChangeTitle, handleTitleBlur = undefined, handleSettingClick, handleRemoveSource, handlePublish, handleUnpublish }) {

    const [isPin, setIsPin] = useState(true)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [tempTitle, setTempTitle] = useState('')
    const dispatch = useDispatch()
    const locale = useLocale()
    const { isMobile } = useDeviceDetect()

    const themeStyles = {
        light: {
            backgroundColor: "white",
            borderBottomColor: 'gray',
            inputBackgroundColor: "white",
            inputColor: "black",
            buttonBackgroundColor: "white",
            buttonColor: "black"
        },
        dark: {
            backgroundColor: "#2e2e2e",
            borderBottomColor: '#555',
            inputBackgroundColor: "#2e2e2e",
            inputColor: "white",
            buttonBackgroundColor: "#555",
            buttonColor: "white"
        }
    }

    const { theme } = useContext(GlobalContext)
    const currentTheme = themeStyles[theme]

    // 响应式样式配置
    const responsiveHeaderStyles: React.CSSProperties | null = isMobile ? {
        flexWrap: 'wrap',
        padding: '8px 0',
    } : null

    const responsiveInputStyles = isMobile ? {
        fontSize: 22,
        marginLeft: 8,
        marginRight: 8,
        height: 50
    } : {
        fontSize: 19,
    }

    const responsiveButtonColStyles = isMobile ? {
        fontSize: 22,
        marginLeft: 8,
        marginRight: 8,
        height: 50,
        whiteSpace: 'nowrap'
    } : {
        fontSize: 18,
        height: 60,
    }

    const handlePinClick = () => {
        const newPinState = !isPin
        setIsPin(newPinState)
        dispatch({
            type: 'toggle-vditor-toolbar-pin',
            payload: {
                vditorToolbarPin: newPinState
            },
        })
    }

    // 开始编辑标题
    const startEditTitle = () => {
        setTempTitle(initTitle)
        setIsEditingTitle(true)
    }

    // 保存标题
    const saveTitle = () => {
        if (tempTitle.trim() === '') {
            message.error('标题不能为空')
            return
        }
        
        handleChangeTitle(tempTitle) // 添加这行，确保父组件的标题状态更新
        setIsEditingTitle(false)
    }

    // 取消编辑
    const cancelEditTitle = () => {
        setTempTitle(initTitle)
        setIsEditingTitle(false)
    }

    // 处理标题输入变化
    const handleTitleChange = (value) => {
        setTempTitle(value)
    }

    return (
        <Row style={{
            width: "100%",
            borderBottomColor: currentTheme.borderBottomColor,
            borderBottom: '1px solid',
            backgroundColor: currentTheme.backgroundColor,
            ...responsiveHeaderStyles
        }} align='middle' className={cs("editor-header", className)}>
            {/* 标题输入 */}
            <Col xs={23} md={16} lg={14}>
                {isEditingTitle ? (
                    <input
                        style={{
                            width: "100%",
                            border: 'none',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontWeight: 500,
                            backgroundColor: currentTheme.inputBackgroundColor,
                            color: currentTheme.inputColor,
                            ...responsiveInputStyles
                        }}
                        value={tempTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onBlur={handleTitleBlur || undefined}
                        autoFocus
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            boxSizing: 'border-box',
                            fontWeight: 500,
                            color: currentTheme.inputColor,
                            ...responsiveInputStyles
                        }}
                    >
                        {initTitle}
                    </div>
                )}
            </Col>

            {/* 操作按钮组 */}
            <Col
                xs={23}
                md={8}
                lg={10}
                offset={isMobile ? 0 : 0}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: !isMobile ? '20px' : undefined,
                    ...responsiveButtonColStyles
                }}>
                <ButtonGroup style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    overflowX: isMobile ? 'auto' : 'visible'
                }}>
                    {/* 标题编辑按钮 */}
                    {isEditingTitle ? (
                        <>
                            <Button 
                                type='primary'
                                icon={<SaveOutlined />}
                                onClick={saveTitle}
                                style={{ 
                                    backgroundColor: currentTheme.buttonBackgroundColor, 
                                    color: currentTheme.buttonColor,
                                    borderColor: theme === 'dark' ? '#555' : '#d9d9d9' // 添加适合主题的边框颜色
                                }}
                            >
                                {isMobile ? '' : locale["editor.header.edit.title.save"]}
                            </Button>
                            <Button 
                                type='default'
                                onClick={cancelEditTitle}
                                style={{ 
                                    backgroundColor: currentTheme.buttonBackgroundColor, 
                                    color: currentTheme.buttonColor,
                                    borderColor: theme === 'dark' ? '#555' : '#d9d9d9' // 添加适合主题的边框颜色
                                }}
                            >
                                {isMobile ? locale["editor.header.edit.title.cancel"] : locale["editor.header.edit.title.cancel"]}
                            </Button>
                        </>
                    ) : (
                        <Button 
                            type='default'
                            icon={<EditOutlined />}
                            onClick={startEditTitle}
                            style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonColor }}
                        >
                            {isMobile ? '' : locale["editor.header.edit.title"]}
                        </Button>
                    )}
                    
                    {/* 移动端优先显示主要操作 */}
                    {!isMobile && (
                        <>

                        </>
                    )}
                    {
                        (isPage || (!isPage && !isDraft)) && (
                                                        <Button
                                type="default"
                                style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonColor }}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    openDesktopLink(permalink)
                                }}
                                icon={theme === 'dark' ? <IconLinkLight /> : <IconLink />}
                            >
                            </Button>
                        )
                    }
                    <Button type='default' icon={isPin ? <IconPinFill /> : <IconPin />}
                        onClick={handlePinClick}
                        style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonColor }} />
                    <Button type='default' icon={<SettingOutlined />}
                        onClick={(e) => handleSettingClick(e)}
                        style={{ borderRight: 'none', backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonColor }} />
                    {!isPage && (isDraft ?
                        <Button type='primary'
                            onClick={handlePublish}
                            style={{
                                zIndex: 2,
                                border: '1px  dashed',
                                borderColor: 'gray',
                                backgroundColor: currentTheme.buttonBackgroundColor,
                                color: currentTheme.buttonColor,
                            }}>
                            {isMobile ? '发布' : locale['editor.header.publish']}
                        </Button>
                        : <Button type='default'
                            onClick={handleUnpublish}
                            style={{
                                backgroundColor: currentTheme.buttonBackgroundColor,
                                color: currentTheme.buttonColor,
                            }}>
                            {locale['editor.header.unpublish']}
                        </Button>
                    )}

                    <Popconfirm
                        title={popTitle}
                        description={popDes}
                        onConfirm={() => {
                            message.info({ content: 'ok' })
                            handleRemoveSource()
                        }}
                        onCancel={() => {
                            message.error({ content: 'cancel' })
                        }}
                    >
                        <Button
                            type='default'
                            icon={<DeleteOutlined />}
                            style={{
                                paddingLeft: isMobile ? 0 : 30,
                                backgroundColor: currentTheme.buttonBackgroundColor,
                                color: currentTheme.buttonColor,
                                width: isMobile ? 'auto' : 'auto',
                                minWidth: isMobile ? '40px' : 'auto',
                                padding: isMobile ? '0 8px' : undefined
                            }} />
                    </Popconfirm>
                </ButtonGroup>
            </Col>
        </Row>
    )
}