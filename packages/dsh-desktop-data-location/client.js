window.__ModuleLoader__.load({
  id: 'dsh-desktop-data-location',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')

    const NS = 'settings.desktopDataLocation'
    const STYLE_ID = 'dsh-desktop-data-location-style'

    const en = {
      nav: 'Data directory',
      title: 'Data directory',
      intro:
        'Sessions, workspaces, model credentials, and installed plugins are stored in this folder. It defaults to the system drive; you can move it to another drive, and the new location is used from the next launch.',
      currentLabel: 'Current location',
      defaultBadge: 'Default',
      customBadge: 'Custom',
      change: 'Change…',
      changing: 'Choosing…',
      reset: 'Restore default',
      resetting: 'Restoring…',
      openFolder: 'Open folder',
      openFailed: 'Could not open the folder.',
      notRestartable: 'This build cannot restart itself. Close and reopen DSH Desktop to apply the change.',
      restartTitle: 'Restart to apply?',
      restartBody:
        'The new data directory takes effect after DSH Desktop restarts. The previous folder is left untouched and is not moved.',
      restartNote: 'Nothing is copied or deleted. The new location starts empty.',
      restartNow: 'Restart now',
      restartLater: 'Later',
      restarting: 'Restarting…',
      restartFailed: 'Could not restart DSH Desktop.',
      savedPending: 'Saved. Restart DSH Desktop to start using the new folder.',
      resetDone: 'Restored to the default location. Restart DSH Desktop to apply it.',
      unchanged: 'That is already the current location.',
      bridgeMissing: 'This setting is only available in the DSH Desktop app.',
      loadFailed: 'Could not read the current data directory.',
      chooseFailed: 'Could not change the data directory.',
      resetFailed: 'Could not restore the default data directory.',
      retry: 'Try again',
      failureNotAbsolute: 'Choose an absolute path, such as E:\\dsh-data.',
      failureCreateFailed: 'That folder could not be created. Check the drive and permissions.',
      failureNotADirectory: 'That path is a file, not a folder.',
      failureNotWritable: 'That folder is not writable. Choose another one or fix its permissions.',
      warningTitle: 'The configured location is unavailable',
      warningBody: 'DSH Desktop fell back to the default folder for this launch:',
      warningHint: 'Reconnect the drive, or choose a new location below.'
    }

    const zh = {
      nav: '数据目录',
      title: '数据目录',
      intro:
        '会话、工作区、模型密钥和已安装插件都保存在这个文件夹里。默认位于系统盘，可以改到其他磁盘，重启后生效。',
      currentLabel: '当前位置',
      defaultBadge: '默认',
      customBadge: '自定义',
      change: '更改…',
      changing: '正在选择…',
      reset: '恢复默认位置',
      resetting: '正在恢复…',
      openFolder: '打开文件夹',
      openFailed: '无法打开该文件夹。',
      notRestartable: '当前构建无法自行重启，请手动关闭并重新打开 DSH Desktop 以生效。',
      restartTitle: '重启后生效？',
      restartBody: '新的数据目录将在 DSH Desktop 重启后生效。原文件夹会原样保留，不会被移动。',
      restartNote: '不会复制或删除任何数据，新位置初始为空。',
      restartNow: '立即重启',
      restartLater: '稍后',
      restarting: '正在重启…',
      restartFailed: '无法重启 DSH Desktop。',
      savedPending: '已保存，重启 DSH Desktop 后开始使用新文件夹。',
      resetDone: '已恢复默认位置，重启 DSH Desktop 后生效。',
      unchanged: '这已经是当前位置。',
      bridgeMissing: '该设置仅在 DSH Desktop 应用内可用。',
      loadFailed: '无法读取当前数据目录。',
      chooseFailed: '无法更改数据目录。',
      resetFailed: '无法恢复默认数据目录。',
      retry: '重试',
      failureNotAbsolute: '请选择绝对路径，例如 E:\\dsh-data。',
      failureCreateFailed: '无法创建该文件夹，请检查磁盘和权限。',
      failureNotADirectory: '该路径是文件，不是文件夹。',
      failureNotWritable: '该文件夹不可写，请换一个或修正权限。',
      warningTitle: '配置的位置不可用',
      warningBody: '本次启动已回退到默认文件夹：',
      warningHint: '请重新连接该磁盘，或在下方选择新位置。'
    }

    const failureKeys = {
      'not-absolute': 'failureNotAbsolute',
      'create-failed': 'failureCreateFailed',
      'not-a-directory': 'failureNotADirectory',
      'not-writable': 'failureNotWritable'
    }

    const css = `
      .dshDesktopDataLocationSection{box-sizing:border-box;max-width:720px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:16px}
      .dshDesktopDataLocationTitle{margin:0;font-size:20px;font-weight:600;line-height:30px}
      .dshDesktopDataLocationIntro{margin:0;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}
      .dshDesktopDataLocationCard{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);border-radius:20px;padding:22px;display:flex;flex-direction:column;gap:16px}
      .dshDesktopDataLocationHead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .dshDesktopDataLocationLabel{font-size:13px;font-weight:600;color:var(--dsw-alias-label-secondary)}
      .dshDesktopDataLocationBadge{border:1px solid var(--dsw-alias-border-l3);border-radius:10px;padding:2px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
      .dshDesktopDataLocationBadgeCustom{border-color:var(--dsw-alias-border-l3);color:var(--dsw-alias-label-primary)}
      .dshDesktopDataLocationPath{margin:0;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:20px;overflow-wrap:anywhere;user-select:text}
      .dshDesktopDataLocationActions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
      .dshDesktopDataLocationButton{box-sizing:border-box;height:36px;padding:0 16px;border:1px solid transparent;border-radius:18px;font:inherit;font-size:14px;font-weight:500;cursor:pointer}
      .dshDesktopDataLocationButton:disabled{opacity:.5;cursor:default}
      .dshDesktopDataLocationPrimary{color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-button-primary-fill)}
      .dshDesktopDataLocationPrimary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
      .dshDesktopDataLocationSecondary{color:var(--dsw-alias-label-primary);background:transparent;border-color:var(--dsw-alias-border-l3)}
      .dshDesktopDataLocationSecondary:hover:not(:disabled){background:var(--dsw-alias-bg-layer-1)}
      .dshDesktopDataLocationStatus{margin:0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
      .dshDesktopDataLocationError{margin:0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-error,var(--dsw-alias-label-primary));overflow-wrap:anywhere}
      .dshDesktopDataLocationWarning{display:flex;flex-direction:column;gap:4px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l3);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
      .dshDesktopDataLocationWarningTitle{margin:0;font-size:13px;font-weight:600}
      .dshDesktopDataLocationWarningBody{margin:0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
      .dshDesktopDataLocationModalBackdrop{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:var(--dsw-alias-bg-mask,rgba(0,0,0,.45))}
      .dshDesktopDataLocationModal{box-sizing:border-box;width:min(440px,calc(100vw - 48px));border:1px solid var(--dsw-alias-border-l2);border-radius:20px;background:var(--dsw-alias-bg-module-platform);padding:22px;display:flex;flex-direction:column;gap:12px;color:var(--dsw-alias-label-primary)}
      .dshDesktopDataLocationModalTitle{margin:0;font-size:17px;font-weight:600;line-height:26px}
      .dshDesktopDataLocationModalText{margin:0;font-size:14px;line-height:22px;color:var(--dsw-alias-label-secondary)}
      .dshDesktopDataLocationModalNote{margin:0;font-size:12px;line-height:19px;color:var(--dsw-alias-label-tertiary)}
      .dshDesktopDataLocationModalActions{display:flex;justify-content:flex-end;gap:10px;padding-top:4px}
      @media (prefers-reduced-motion:no-preference){.dshDesktopDataLocationButton{transition:background-color .15s ease}}
    `

    function installStyles() {
      if (document.getElementById(STYLE_ID)) return
      const tag = document.createElement('style')
      tag.id = STYLE_ID
      tag.textContent = css
      document.head.appendChild(tag)
    }

    /**
     * The bridge is absent when the settings UI runs outside the desktop shell
     * (a plain Harness web session), so every call site has to tolerate it.
     */
    function bridge() {
      const value = globalThis.dshDataLocation
      return value && typeof value.get === 'function' ? value : undefined
    }

    function RestartConfirm({ t, busy, onCancel, onConfirm }) {
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key === 'Escape' && !busy) onCancel()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [busy, onCancel])

      return React.createElement(
        'div',
        {
          className: 'dshDesktopDataLocationModalBackdrop',
          role: 'presentation',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) onCancel()
          }
        },
        React.createElement(
          'div',
          {
            className: 'dshDesktopDataLocationModal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'dsh-desktop-data-location-restart-title'
          },
          React.createElement(
            'h3',
            {
              id: 'dsh-desktop-data-location-restart-title',
              className: 'dshDesktopDataLocationModalTitle'
            },
            t('restartTitle')
          ),
          React.createElement('p', { className: 'dshDesktopDataLocationModalText' }, t('restartBody')),
          React.createElement('p', { className: 'dshDesktopDataLocationModalNote' }, t('restartNote')),
          React.createElement(
            'div',
            { className: 'dshDesktopDataLocationModalActions' },
            React.createElement(
              'button',
              {
                type: 'button',
                className:
                  'dshDesktopDataLocationButton dshDesktopDataLocationSecondary',
                disabled: busy,
                onClick: onCancel
              },
              t('restartLater')
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'dshDesktopDataLocationButton dshDesktopDataLocationPrimary',
                disabled: busy,
                onClick: onConfirm,
                autoFocus: true
              },
              busy ? t('restarting') : t('restartNow')
            )
          )
        )
      )
    }

    function DataLocationSection({ t }) {
      const [snapshot, setSnapshot] = React.useState()
      const [error, setError] = React.useState()
      const [status, setStatus] = React.useState()
      const [pending, setPending] = React.useState()
      const [confirming, setConfirming] = React.useState(false)
      const [restarting, setRestarting] = React.useState(false)
      const [reload, setReload] = React.useState(0)
      const available = bridge() !== undefined

      React.useEffect(() => {
        if (!available) return
        let disposed = false
        void (async () => {
          try {
            const next = await bridge().get()
            if (disposed) return
            setSnapshot(next)
            setError(undefined)
          } catch (failure) {
            if (disposed) return
            setError(failure instanceof Error ? failure.message : t('loadFailed'))
          }
        })()
        return () => {
          disposed = true
        }
      }, [available, reload])

      const failureText = (reason) => t(failureKeys[reason] ?? 'chooseFailed')

      const choose = async () => {
        setPending('choose')
        setError(undefined)
        setStatus(undefined)
        try {
          const result = await bridge().choose()
          if (result.status === 'cancelled') return
          if (result.status === 'invalid') {
            setError(failureText(result.reason))
            return
          }
          setSnapshot(result.snapshot)
          if (result.status === 'unchanged') {
            setStatus(t('unchanged'))
            return
          }
          setStatus(t('savedPending'))
          setConfirming(true)
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : t('chooseFailed'))
        } finally {
          setPending(undefined)
        }
      }

      const reset = async () => {
        setPending('reset')
        setError(undefined)
        setStatus(undefined)
        try {
          const next = await bridge().reset()
          setSnapshot(next)
          setStatus(t('resetDone'))
          setConfirming(true)
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : t('resetFailed'))
        } finally {
          setPending(undefined)
        }
      }

      const openFolder = async () => {
        const path = snapshot && snapshot.currentPath
        if (!path) return
        const desktop = globalThis.dshDesktop
        if (!desktop || typeof desktop.openInFinder !== 'function') return
        try {
          await desktop.openInFinder(path)
        } catch {
          setError(t('openFailed'))
        }
      }

      const restart = async () => {
        const api = bridge()
        if (!api || typeof api.restart !== 'function') {
          setConfirming(false)
          setError(t('notRestartable'))
          return
        }
        setRestarting(true)
        setError(undefined)
        try {
          await api.restart()
        } catch (failure) {
          setRestarting(false)
          setConfirming(false)
          setError(failure instanceof Error ? failure.message : t('restartFailed'))
        }
      }

      if (!available) {
        return React.createElement(
          'section',
          { className: 'dshDesktopDataLocationSection' },
          React.createElement('h2', { className: 'dshDesktopDataLocationTitle' }, t('title')),
          React.createElement('p', { className: 'dshDesktopDataLocationIntro' }, t('intro')),
          React.createElement('p', { className: 'dshDesktopDataLocationError', role: 'alert' }, t('bridgeMissing'))
        )
      }

      const busy = pending !== undefined
      const warning = snapshot && snapshot.warning

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'section',
          { className: 'dshDesktopDataLocationSection' },
          React.createElement('h2', { className: 'dshDesktopDataLocationTitle' }, t('title')),
          React.createElement('p', { className: 'dshDesktopDataLocationIntro' }, t('intro')),
          React.createElement(
            'div',
            { className: 'dshDesktopDataLocationCard' },
            React.createElement(
              'div',
              { className: 'dshDesktopDataLocationHead' },
              React.createElement('span', { className: 'dshDesktopDataLocationLabel' }, t('currentLabel')),
              snapshot
                ? React.createElement(
                    'span',
                    {
                      className: `dshDesktopDataLocationBadge${snapshot.custom ? ' dshDesktopDataLocationBadgeCustom' : ''}`
                    },
                    snapshot.custom ? t('customBadge') : t('defaultBadge')
                  )
                : null
            ),
            snapshot
              ? React.createElement('p', { className: 'dshDesktopDataLocationPath' }, snapshot.currentPath)
              : null,
            warning
              ? React.createElement(
                  'div',
                  { className: 'dshDesktopDataLocationWarning', role: 'alert' },
                  React.createElement('p', { className: 'dshDesktopDataLocationWarningTitle' }, t('warningTitle')),
                  React.createElement(
                    'p',
                    { className: 'dshDesktopDataLocationWarningBody' },
                    `${t('warningBody')} ${failureText(warning.reason)}`
                  ),
                  React.createElement('p', { className: 'dshDesktopDataLocationWarningBody' }, t('warningHint')),
                  React.createElement('p', { className: 'dshDesktopDataLocationWarningBody' }, warning.configuredPath)
                )
              : null,
            React.createElement(
              'div',
              { className: 'dshDesktopDataLocationActions' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'dshDesktopDataLocationButton dshDesktopDataLocationPrimary',
                  disabled: busy,
                  onClick: () => void choose()
                },
                pending === 'choose' ? t('changing') : t('change')
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'dshDesktopDataLocationButton dshDesktopDataLocationSecondary',
                  disabled: busy || !snapshot || !snapshot.custom,
                  onClick: () => void reset()
                },
                pending === 'reset' ? t('resetting') : t('reset')
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'dshDesktopDataLocationButton dshDesktopDataLocationSecondary',
                  disabled: busy || !snapshot,
                  onClick: () => void openFolder()
                },
                t('openFolder')
              ),
              !snapshot && !error
                ? React.createElement('button', {
                    type: 'button',
                    className: 'dshDesktopDataLocationButton dshDesktopDataLocationSecondary',
                    onClick: () => setReload((value) => value + 1)
                  }, t('retry'))
                : null
            ),
            React.createElement(
              'p',
              { className: 'dshDesktopDataLocationStatus', role: 'status', 'aria-live': 'polite' },
              status ?? ''
            ),
            error
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement('p', { className: 'dshDesktopDataLocationError', role: 'alert' }, error),
                  !snapshot
                    ? React.createElement(
                        'button',
                        {
                          type: 'button',
                          className: 'dshDesktopDataLocationButton dshDesktopDataLocationSecondary',
                          onClick: () => {
                            setError(undefined)
                            setReload((value) => value + 1)
                          }
                        },
                        t('retry')
                      )
                    : null
                )
              : null
          )
        ),
        confirming
          ? React.createElement(RestartConfirm, {
              t,
              busy: restarting,
              onCancel: () => setConfirming(false),
              onConfirm: () => void restart()
            })
          : null
      )
    }

    const inject = ['slots', 'locale']
    function apply(ctx) {
      installStyles()
      ctx.effect(
        () => ctx.locale.register(NS, { zh, en }),
        'dsh-desktop-data-location: copy dictionaries'
      )
      const t = ctx.locale.bind(NS)
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'data-location',
            order: 45,
            label: () => t('nav'),
            locale: NS,
            inject: () => ({ t })
          },
          DataLocationSection
        )
      )
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
