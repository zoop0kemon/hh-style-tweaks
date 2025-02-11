// ==UserScript==
// @name            Hentai Heroes Style Tweaks
// @description     Some styling tweaks for HH, with some support for GH and CxH
// @version         0.4.0
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @downloadURL     https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @grant           none
// @author          45026831(Numbers)
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.4.0: Adding tweak for Daily Goals
// 0.3.1: Adjusting PoV tweak to allow for longer objectives
// 0.3.0: Refactoring tweaks into self-contained modules to hook into HH++ 1.0.0
// 0.2.37: Adding tweak to declutter PoV
// 0.2.36: Adjusting monthly card text again to account for gems.
// 0.2.35: Recolouring compact PoPs for gem (secondary) rewards
// 0.2.34: Adding league table stripe colour for CxH, fixing bug on CxH with HH++ individual scores overflowing the cell
// 0.2.33: Adjusting league left block positioning after change in game.
// 0.2.32: Removing PoA thousands seperators tweak as this is now in the base game
// 0.2.31: Adding support for element icons replacing class icons (HH++)
// 0.2.30: Removing legacy PoA tweaks as the page is now gone.
// 0.2.29: Improving styles on compact PoPs
// 0.2.28: Changing config to 3 columns to reduce risk of running offscreen
// 0.2.27: Adding border colours to some of the compact pops to help distinguish them more
// 0.2.26: Updating the button styles to include purple
// 0.2.25: Updating compact PoPs tweak with new temporary PoPs
// 0.2.24: Adding tweak to fix monthly card text, courtesy of KominoStyle
// 0.2.23: Adding tweak for compact PoP thumbs in the list
// 0.2.22: Fixing GH new button colours (actually adding them this time)
// 0.2.21: Adjusting league button tweak to acount for larger x15 button
// 0.2.20: Adding new button colours for GH
// 0.2.19: Expanding league change team button tweak to encompass the other items in the left block
// 0.2.18: Changing script to run at document-body to reduce FOUC
// 0.2.17: Changing old-to-new buttons tweak to be a full CSS override rather than just swapping out the classes. Done for HH and CxH.
// 0.2.16: Adding tweak to adjust the position of the Change team button in league
// 0.2.15: Removing leftover debug
// 0.2.14: Adjusting PoA thousand seperators tweak to cover tooltips as well
// 0.2.13: Adding tweak to prevent champion girl (most obvious example is Kumiko) from overlapping the girl selection
// 0.2.12: Removing promo banners tweak. Updates will be done in HH++ itself going forward.
// 0.2.11: Fixing PoA tick position tweak to respect game-specific colours
// 0.2.10: Adding tweak to fix girl pose fade on PoA
// 0.2.9: Removing no longer needed scrollbar tweak for PoA
// 0.2.8: Adding tweak for contest table points to prevent the medal icon from falling onto another row
// 0.2.7: Adding tweak for contest notifications
// 0.2.6: Adding tweak to hide the new PoP buttons
// 0.2.5: Properly re-tweaking compact main menu as a grid
// 0.2.4: Removing unnecessary selector that was intended to get stripes working with HH++ Hide
// 0.2.3: Re-tweaking the compact main menu after UI changes in-game
// 0.2.2: Extracting lang and locale from html tag instead of browser
// 0.2.1: Applying same compact nav styles on all sites due to overflows on the nav items in some languages
// 0.2.0: Adding proper support for GH and CxH
// 0.1.10: Adding burger menu rules for HH.com
// 0.1.9: Adding a preventative measure against flower overflow on long girl names such as "Anniversary Bunny's Mother"
// 0.1.8: Adding a tweak to correct the aspect ratio on the girl poses in the new battle animations
// 0.1.7: Adding style for promotion markers on compact league table
// 0.1.6: Increasing z-index of skip button to be on top of all girls
// 0.1.5: Adding a tweak to move the skip button back to the bottom on the new battle screen
// 0.1.4: Fixing compact league table in OperaGX
// 0.1.3: Adding circular border for config button
// 0.1.2: Fixing specificity of compact table styles
// 0.1.1: Removing black border from config button to work around sub-pixel rendering issues. Making league table stripes its own config option.
// 0.1.0: Major refactor to include configuration.
// 0.0.14: Adding jquery to replace all old style buttons with new-stlye buttons.
// 0.0.13: Removing tweaks for old PoA screen, fixing scrollbar for new PoA screen.
// 0.0.12: Aligning blessings button with burger menu.
// 0.0.11: Shrinking bundles, hiding links to other games, lowering socials to not overlap with HH++ bars
// 0.0.10: Burger menu tweaks
// 0.0.9: Changing ticks again. Now using gradients as an overlay to simulate an empty tick
// 0.0.8: Adding sidequest completion markers
// 0.0.7: Commenting out override for champions ticks following improvement from HH++ script
// 0.0.6: Overriding the HH++ script's poor 'fix' for the white champions ticks
// 0.0.5: Overriding event girl tick marks with a higher res tick image
// 0.0.4: Prettifying PoA steps so the step number no longer overflows and the progress bar corner rounding is on the correct side
// 0.0.3: Removing particle effects on the town screen
// 0.0.2: Added Seasons button border fix, league table compressed view, league table scroll shadow fix
// 0.0.1: Initial version. Adding tweaks for league stat box alignment and opponent team star overflow

(() => {
    const {$, localStorage, location} = window
    const LS_CONFIG_NAME = 'HHStyleTweaksConfig'
    const currentPage = location.pathname

    if (!$) {
        console.log('STYLE TWEAKS WARNING: No jQuery found. Probably an error page. Ending the script here');
        return;
    }

    const lang = $('html')[0].lang.substring(0,2)
    let locale = 'fr'
    if (lang === 'en') {
        locale = 'en'
    }

    // Game detection
    const isGH = [
        'www.gayharem.com',
        'nutaku.gayharem.com'
    ].includes(location.host)
    const isCxH = [
        'www.comixharem.com',
        'nutaku.comixharem.com'
    ].includes(location.host)
    const isHH = !(isGH || isCxH)

    const CDNs = {
        'nutaku.haremheroes.com': 'hh.hh-content.com',
        'www.hentaiheroes.com': 'hh2.hh-content.com',
        'www.comixharem.com': 'ch.hh-content.com',
        'nutaku.comixharem.com': 'ch.hh-content.com',
        'www.gayharem.com': 'gh1.hh-content.com',
        'nutaku.gayharem.com': 'gh.hh-content.com'
    }
    const cdnHost = CDNs[location.host] || 'hh.hh-content.com'

    const gameConfigs = {
        HH: {
            girl: 'girl',
            homeColor: '#ffb827',
            darkColor: '#300912',
            tableRow: 'rgba(191,40,90,.25)',
            flower: 'flower'
        },
        GH: {
            girl: 'guy',
            homeColor: '#69daff',
            darkColor: '#1b0d37',
            tableRow: 'rgba(191,40,90,.25)',
            flower: 'lollipop'
        },
        CxH: {
            girl: 'girl',
            homeColor: 'black',
            darkColor: '#0f0b1d',
            tableRow: 'rgba(36,88,255,.25)',
            flower: 'jewel'
        }
    }
    const gameConfig = isGH ? gameConfigs.GH : isCxH ? gameConfigs.CxH : gameConfigs.HH

    const HC = 1;
    const CH = 2;
    const KH = 3;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();



    class STModule {
        constructor ({name, configSchema}) {
            this.group = 'st'
            this.name = name
            this.configSchema = configSchema
            this.hasRun = false

            this.insertedRuleIndexes = []
            this.sheet = sheet
        }

        run () {
            if (!this.shouldRun() || this.hasRun) {
                return
            }

            this.injectCss()

            this.hasRun = true
        }

        insertRule (rule) {
            this.insertedRuleIndexes.push(this.sheet.insertRule(rule))
        }

        tearDown () {
            this.insertedRuleIndexes.sort((a, b) => b-a).forEach(index => {
                this.sheet.deleteRule(index)
            })

            this.insertedRuleIndexes = []
            this.hasRun = false
        }
    }

    class SeasonsButtonBorder extends STModule {
        constructor () {
            const baseKey = 'seasonsButton'
            const configSchema = {
                baseKey,
                default: isHH || isGH,
                label: 'Fix border on Seasons button'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('home')}

        injectCss() {
            this.insertRule(`
                #homepage>a:hover>.position>span.seasons_button {
                    border: 1px solid ${gameConfig.homeColor};
                }
            `)
        }
    }

    class LeagueTableCompact extends STModule {
        constructor () {
            const baseKey = 'leagueTableCompressed'
            const configSchema = {
                baseKey,
                default: isHH || isGH,
                label: 'Compact league table'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('tower-of-fame')}

        injectCss() {
            // League table compressed view
            this.insertRule(`
                .lead_table .square-avatar-wrapper {
                    height: 21px;
                    width: 21px;
                }
            `)
            this.insertRule(`
                .lead_table .square-avatar-wrapper img {
                    height: 15px;
                    width: 15px;
                }
            `)
            // Numbers' HH++ script version
            this.insertRule(`
                .lead_table .square-avatar-wrapper div.classLeague {
                    left: -22px !important;
                    top: 2px !important;
                }
            `)
            this.insertRule(`
                .lead_table .square-avatar-wrapper div.classLeague img.theme-icon {
                    height: 15px !important;
                    width: 15px !important;
                }
            `)

            // Tom208's HH++ script version
            this.insertRule(`
                .lead_table .square-avatar-wrapper img.classLeague {
                    height: 15px !important;
                    width: 15px !important;
                    top: -4px;
                    left: -22px !important;
                }
            `)
            this.insertRule(`
                .lead_table .country {
                    transform: scale(0.5);
                    margin: 0px !important;
                }
            `)
            this.insertRule(`
                .lead_table tbody tr {
                    height: 21px !important;
                    line-height: 21px !important;
                }
            `)
            this.insertRule(`
                .lead_table table tbody tr>td .nickname {
                    width: 242px;
                }
            `)
            this.insertRule(`
                .lead_table table tbody tr>td {
                    font-size: 13px;
                }
            `)
            this.insertRule(`
                .lead_table table tbody tr>td:first-child .promotion {
                    margin-right: 26px;
                    height: 16px;
                }
            `)
            this.insertRule(`
                #leagues_middle .lead_table table tbody tr td:nth-child(4), #leagues_middle .lead_table table thead th:nth-child(4), #leagues_middle .use-lead-table table tbody tr td:nth-child(4), #leagues_middle .use-lead-table table thead th:nth-child(4) {
                    width: 75px;
                }
            `)
        }
    }

    class LeagueTableRowStripes extends STModule {
        constructor () {
            const baseKey = 'leagueTableRowStripes'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Striped league table rows'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('tower-of-fame')}

        injectCss() {
            this.insertRule(`
                .lead_table table tbody tr:nth-of-type(even) {
                    background-color: ${gameConfig.tableRow};
                }
            `)
        }
    }

    class LeagueTableShadow extends STModule {
        constructor () {
            const baseKey = 'leagueTableShadow'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Remove league table shadow'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('tower-of-fame')}

        injectCss() {
            this.insertRule(`
                #leagues_middle .lead_table .lead_table_view::after {
                    display: none;
                }
            `)
        }
    }

    class ClubTableShadow extends STModule {
        constructor () {
            const baseKey = 'clubTableShadow'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Remove club table shadow'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('clubs')}

        injectCss() {
            this.insertRule(`
                .inner_club_tables>.lead_table_view::after {
                    display: none;
                }
            `)
        }
    }

    class RemoveParticleEffects extends STModule {
        constructor () {
            const baseKey = 'removeParticleEffects'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Remove home screen particle effects'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('home')}

        injectCss() {
            this.insertRule(`
                .bg_animation {
                    display:none;
                    animation:none !important;
                    transform:none;
                    -webkit-transform:none;
                }
            `)
        }
    }

    class EventGirlTicks extends STModule {
        constructor () {
            const baseKey = 'eventGirlTicks'
            const configSchema = {
                baseKey,
                default: true,
                label: `Improved event ${gameConfig.girl} ticks`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('event.html')}

        injectCss() {
            // Event girl ticks - this might be legacy now.
            this.insertRule(`
                .event-widget .widget .rewards-block-tape .girl_reward[reward_was_won]:after, .event-widget .widget .rewards-block-tape .set_items_box[reward_was_won]:after {
                    background-image: url(https://hh.hh-content.com/clubs/ic_Tick.png);
                }
            `)

            // Fixing tick clipping for completed event girls
            this.insertRule(`
                #events .nc-event-list-reward.already-owned:after {
                    width: 26px;
                }
            `)
        }
    }

    class EventGirlBorders extends STModule {
        constructor () {
            const baseKey = 'eventGirlBorders'
            const configSchema = {
                baseKey,
                default: true,
                label: `Green borders on obtained event ${gameConfig.girl}s`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('event.html')}

        injectCss() {
            this.insertRule(`
                #events .nc-event-list-reward.already-owned {
                    border-color: #75b400;
                }
            `)
        }
    }

    class SidequestCompletionMarkers extends STModule {
        constructor () {
            const baseKey = 'sidequestCompletionMarkers'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Sidequest completion markers'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('side-quests')}

        injectCss() {
            // Sidequest completion markers
            this.insertRule(`
                .complete .side-quest-image {
                    border-color: #75b400;
                }
            `)
            this.insertRule(`
                .complete .side-quest-image::after {
                    content: '';
                    background-image: url(https://${cdnHost}/clubs/ic_Tick.png);
                    background-position: center;
                    background-repeat: no-repeat;
                    display: block;
                    position: relative;
                    width: 30px;
                    height: 30px;
                    background-size: 30px;
                    margin: -15px;
                    padding: 0;
                    bottom: 2px;
                    left: 132px;
                }
            `)
            this.insertRule(`
                .complete .side-quest-progress {
                    color: #75b400;
                }
            `)
            window.jQuery('.side-quest').has('.Read').addClass('complete')
        }
    }

    class CompactNav extends STModule {
        constructor () {
            const baseKey = 'compactNav'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Use compact main menu'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #contains_all>nav>[rel=content] .extender {
                    display: none;
                }
            `)
            this.insertRule(`
                #contains_all>nav>[rel=content]>div {
                    height: auto;
                    width: auto;
                    padding: 18px 10px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
            `)
            this.insertRule(`
                #contains_all>nav>[rel=content]>div>a {
                    width: auto;
                    height: auto;
                    margin: 5px 10px;
                    padding: 5px 9px;
                    font-size: 12px;
                    line-height: 20px;
                }
            `)
            this.insertRule(`
                #contains_all>nav>[rel=content]>div>a>div {
                    margin: 0px;
                }
            `)
            this.insertRule(`
                #contains_all>nav>[rel=content]>div>a>div ic {
                    width: 20px;
                    height: 20px;
                }
            `)
        }
    }

    class PoABorders extends STModule {
        constructor () {
            const baseKey = 'poaBorders'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Green borders on obtained PoA rewards'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('event.html')}

        injectCss() {
            this.insertRule(`
                #events .nc-panel-body .nc-poa-reward-container.claimed .slot,
                #events .nc-panel-body .nc-poa-reward-container.claimed .shards_girl_ico {
                    border-color: #75b400;
                }
            `)
        }
    }

    class ChampGirlPower extends STModule {
        constructor () {
            const baseKey = 'champGirlPower'
            const configSchema = {
                baseKey,
                default: true,
                label: `Fix Champion ${gameConfig.girl} power overflow`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('champions') || currentPage.includes('club-champion')}

        injectCss() {
            this.insertRule(`
                .girl-selection__girl-box [carac=damage] {
                    font-size: 10px;
                }
            `)
        }
    }

    class ChampGirlOverlap extends STModule {
        constructor () {
            const baseKey = 'champGirlOverlap'
            const configSchema = {
                baseKey,
                default: true,
                label: `Fix Champion ${gameConfig.girl} overlapping ${gameConfig.girl} selection`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('champions') || currentPage.includes('club-champion')}

        injectCss() {
            this.insertRule(`
                .champions-over__girl-image {
                    right: 285px;
                }
            `)
        }
    }

    class HideGameLinks extends STModule {
        constructor () {
            const baseKey = 'hideGameLinks'
            const configSchema = {
                baseKey,
                default: false,
                label: 'Hide game links'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('home')}

        injectCss() {
            this.insertRule(`
                a.redirect {
                    display: none;
                }
            `)
        }
    }

    class ScriptSocials extends STModule {
        constructor () {
            const baseKey = 'scriptSocials'
            const configSchema = {
                baseKey,
                default: false,
                label: 'Adjust position of socials to not overlap with HH++ bars'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('home')}

        injectCss() {
            this.insertRule(`
                .social {
                    margin-top: 20px;
                }
            `)
        }
    }

    class ScriptTimerBars extends STModule {
        constructor () {
            const baseKey = 'scriptTimerBars'
            const configSchema = {
                baseKey,
                default: false,
                label: 'Script timer bars'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #PoPTimer, #BoosterTimer {
                    margin-top: 52px;
                    font-size: 11px;
                    height: 7px;
                    box-shadow: 0 0 1px 0 #fff;
                    background: rgba(102,136,153,.67);
                    text-shadow: 1px 1px 0 #057,-1px 1px 0 #057,-1px -1px 0 #057,1px -1px 0 #057,3px 1px 5px #000;
                }
            `)

            this.insertRule(`
                #PoPTimer .white_text, #BoosterTimer .white_text {
                    top: -2px;
                    text-align: left;
                    text-shadow: 1px 1px 0 #057,-1px 1px 0 #057,-1px -1px 0 #057,1px -1px 0 #057,3px 1px 5px #000;
                }
            `)

            this.insertRule(`
                #PoPTimer [rel=pop_count_txt], #BoosterTimer [rel=booster_count_txt] {
                    color: inherit !important;
                }
            `)

            this.insertRule(`
                #PoPTimer .popTooltip, #BoosterTimer .boosterTooltip {
                    text-shadow: none;
                }
            `)
        }
    }

    class ShrinkBundles extends STModule {
        constructor () {
            const baseKey = 'shrinkBundles'
            const configSchema = {
                baseKey,
                default: false,
                label: 'Shrink bundles'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('home')}

        injectCss() {
            this.insertRule(`
                #homepage #offers {
                    transform: scale(0.5);
                    transform-origin: bottom left;
                    display: grid;
                    grid-template-rows: auto auto;
                    height: 140px;
                    grid-auto-flow: column;
                }
            `)
            this.insertRule(`
                #homepage #offers>* {
                    height: 70px;
                }
            `)
        }
    }

    class BlessingsButtonAlign extends STModule {
        constructor () {
            const baseKey = 'blessingsButtonAlign'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Align blessings button'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                body>div>header #blessings-button {
                    margin-top: 6px;
                }
            `)
        }
    }

    class PoATicks extends STModule {
        constructor () {
            const baseKey = 'poaTicks'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Fix tick positions on PoA screen'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('event.html')}

        injectCss() {
            this.insertRule(`
                #events .nc-panel-body .nc-poa-reward-container {
                    padding: 5px;
                    border: 3px solid ${gameConfig.darkColor};
                }
            `)
            this.insertRule(`
                #events .nc-panel-body .nc-poa-reward-container .nc-claimed-reward-check {
                    top: -1px;
                    left: 0px;
                }
            `)
        }
    }

    class PoAGirlFade extends STModule {
        constructor () {
            const baseKey = 'poaGirlFade'
            const configSchema = {
                baseKey,
                default: true,
                label: `Fix ${gameConfig.girl} pose fade on PoA`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('event.html')}

        injectCss() {
            this.insertRule(`
                #events .nc-panel-body #poa-content .girls .girls-container .girl-avatar{
                    -webkit-mask-image: none;
                    mask-image: none;
                }
            `)
            this.insertRule(`
                #events .nc-panel-body #poa-content .girls .girls-container {
                    -webkit-mask-image: linear-gradient(to top,transparent 30%,rgba(0,0,0,.1) 40%,#000 60%);
                    mask-image: linear-gradient(to top,transparent 30%,rgba(0,0,0,.1) 40%,#000 60%);
                }
            `)
        }
    }

    class NewButtons extends STModule {
        constructor () {
            const baseKey = 'newButtons'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Replace remaining old-style buttons'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            if (isHH || isGH) {
                let colors
                if (isHH) {
                    colors = {
                        orange: {
                            start: '#f90',
                            end: '#f70'
                        },
                        blue: {
                            start: '#008ed5',
                            end: '#05719c'
                        },
                        purple: {
                            start: '#e3005b',
                            end: '#820040',
                            shadow: '#e15'
                        }
                    }
                }
                if (isGH) {
                    colors = {
                        orange: {
                            start: '#fdda00',
                            end: '#bf8d00'
                        },
                        blue: {
                            start: '#4bb',
                            end: '#077'
                        },
                        purple: {
                            start: '#e3005b',
                            end: '#820040',
                            shadow: '#b2b'
                        }
                    }
                }
                this.insertRule(`
                    .blue_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                        -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                        box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                        border: 1px solid #000;
                        background-image: linear-gradient(to top,${colors.blue.start} 0,${colors.blue.end} 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                    }
                `)
                this.insertRule(`
                    .blue_text_button[disabled], .orange_text_button[disabled] {
                        -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        color: #fff;
                        border: 1px solid #000!important;
                        background-color: #960530!important;
                        background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                    }
                `)
                this.insertRule(`
                    .orange_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                        -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                        box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                        border: 1px solid #000;
                        background-image: linear-gradient(to top,${colors.orange.start} 0,${colors.orange.end} 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                    }
                `)
                this.insertRule(`
                    .green_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        -moz-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        border: 1px solid #000;
                        background-image: linear-gradient(to top,#619f00 0,#570 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                    }
                `)
                this.insertRule(`
                    .green_text_button[disabled] {
                        -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        color: #fff;
                        border: 1px solid #000!important;
                        background-color: #960530!important;
                        background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                    }
                `)
                this.insertRule(`
                    .purple_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                        -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                        box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                        border: 1px solid #000;
                        background-image: linear-gradient(to top,${colors.purple.start} 0,${colors.purple.end} 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                    }
                `)
            } else if (isCxH) {
                this.insertRule(`
                    .green_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        -moz-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                        border: 1px solid #000;
                        background-image: linear-gradient(to top,#619f00 0,#570 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                    }
                `)
                this.insertRule(`
                    .green_text_button[disabled] {
                        -webkit-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                        -moz-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                        box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        color: #fff;
                        border: 1px solid #000!important;
                        background-color: #960530!important;
                        background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                    }
                `)
                this.insertRule(`
                    .purple_text_button {
                        padding: 10px 20px;
                        color: #fff;
                        -webkit-border-radius: 7px;
                        -moz-border-radius: 7px;
                        border-radius: 7px;
                        -webkit-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                        -moz-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                        box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                        border: 1px solid #000;
                        background-image: linear-gradient(to bottom,#ff5fff 0,#c91be0 100%);
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        -webkit-transition: box-shadow 90ms ease-in-out;
                        -moz-transition: box-shadow 90ms ease-in-out;
                        -o-transition: box-shadow 90ms ease-in-out;
                        transition: box-shadow 90ms ease-in-out;
                        font-size: 12px;
                        text-transform: uppercase;
                        box-shadow: 0 3px #150017;
                        border: 1px solid #30001f;
                    }
                `)
            }
        }
    }

    class MoveSkipButton extends STModule {
        constructor () {
            const baseKey = 'moveSkipButton'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Move the battle skip button down'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #new_battle #new-battle-skip-btn {
                    position: relative;
                    top: 388px;
                    z-index: 20;
                }
            `)
        }
    }

    class PoseAspectRatio extends STModule {
        constructor () {
            const baseKey = 'poseAspectRatio'
            const configSchema = {
                baseKey,
                default: true,
                label: `Fix ${gameConfig.girl} pose aspect ratio in battle`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #new_battle .new-battle-girl-container {
                    height: 450px;
                    margin-top: -40px;
                }
            `)
        }
    }

    class BonusFlowersOverflow extends STModule {
        constructor () {
            const baseKey = 'bonusFlowersOverflow'
            const configSchema = {
                baseKey,
                default: true,
                label: `Prevent bonus ${gameConfig.flower}s dropping off-screen`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #popups .shards_name {
                    max-width: 340px;
                    line-height: 20px;
                }
            `)
        }
    }

    class PoPButtons extends STModule {
        constructor () {
            const baseKey = 'popButtons'
            const configSchema = {
                baseKey,
                default: false,
                label: 'Hide Auto-assign and Auto-claim PoP buttons'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            this.insertRule(`
                #pop .pop_list .pop-action-btn {
                    display: none;
                }
            `)
        }
    }

    class ContestNotifs extends STModule {
        constructor () {
            const baseKey = 'contestNotifs'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Move contest notifications'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #popups #objective_popup, #sliding-popups #objective_popup {
                    left: unset;
                }
            `)
            this.insertRule(`
                #popups #objective_popup .noti_box, #sliding-popups #objective_popup .noti_box {
                    left: 0px;
                    right: unset;
                    border-radius: 0 .5rem .5rem 0;
                    padding: .25rem .5rem .25rem 1rem;
                }
            `)
            this.insertRule(`
                #popups #objective_popup .noti_box:before, #sliding-popups #objective_popup .noti_box:before {
                    background: transparent linear-gradient(90deg,rgba(255,162,62,0) 0,#ffa23e 100%) 0 0 no-repeat padding-box;
                    border-radius: 0 .5rem .5rem 0;
                }
            `)
            this.insertRule(`
                #popups #objective_popup .noti_box:after, #sliding-popups #objective_popup .noti_box:after {
                    border-radius: 0 .25rem .25rem 0;
                    background: transparent linear-gradient(90deg,#200307 0,#410009 100%) 0 0 no-repeat padding-box;
                }
            `)
        }
    }

    class ContestPointsWidth extends STModule {
        constructor () {
            const baseKey = 'contestPointsWidth'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Prevent contest table points overflow'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            this.insertRule(`
                #contests>div>div.right_part>.ranking table tbody tr td:nth-child(2) {
                    width: 230px;
                }
            `)
            this.insertRule(`
                #contests>div>div.right_part>.ranking table tbody tr td:nth-child(3) {
                    width: 125px;
                }
            `)
        }
    }

    class LeagueChangeTeamButton extends STModule {
        constructor () {
            const baseKey = 'leagueChangeTeamButton'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Fix positioning of left block buttons in league'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('tower-of-fame')}

        injectCss() {
            this.insertRule(`
                .player_block .change_team__btn_container {
                    margin-top: 0;
                }
            `)
            this.insertRule(`
                .player_block .challenge_points .bar-wrap {
                    margin-bottom: 0px;
                }
            `)
            this.insertRule(`
                #leagues_left .multiple-battles {
                    margin-top: 6px;
                }
            `)
        }
    }

    class CompactPoPs extends STModule {
        constructor () {
            const baseKey = 'compactPops'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Compact PoPs'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            const pops = [
                {id: 1, carac: HC, reward: 'shard'},
                {id: 2, carac: KH, reward: 'shard'},
                {id: 3, carac: CH, reward: 'shard'},
                {id: 4, carac: HC, reward: 'ymen'},
                {id: 5, carac: CH, reward: 'ymen'},
                {id: 6, carac: KH, reward: 'ymen'},
                {id: 7, carac: HC, reward: 'koban'},
                {id: 8, carac: CH, reward: 'koban'},
                {id: 9, carac: KH, reward: 'koban'},
                {id: 10, carac: HC, reward: 'gem'},
                {id: 11, carac: CH, reward: 'gem'},
                {id: 12, carac: KH, reward: 'gem'},
                {id: 13, carac: HC, reward: 'orb'},
                {id: 14, carac: CH, reward: 'orb'},
                {id: 15, carac: KH, reward: 'orb'},
                {id: 16, carac: HC, reward: 'booster'},
                {id: 17, carac: CH, reward: 'booster'},
                {id: 18, carac: KH, reward: 'booster'},
                {id: 19, carac: HC, reward: 'ticket'},
                {id: 20, carac: CH, reward: 'ticket'},
                {id: 21, carac: KH, reward: 'ticket'},
                {id: 22, carac: HC, reward: 'gift'},
                {id: 23, carac: CH, reward: 'gift'},
                {id: 24, carac: KH, reward: 'gift'},
            ]
            const hcPops = pops.filter(({carac})=>carac===HC)
            const chPops = pops.filter(({carac})=>carac===CH)
            const khPops = pops.filter(({carac})=>carac===KH)
            const caracPops = [
                {pops: hcPops, icon: `https://${cdnHost}/caracs/hardcore.png`},
                {pops: chPops, icon: `https://${cdnHost}/caracs/charm.png`},
                {pops: khPops, icon: `https://${cdnHost}/caracs/knowhow.png`}
            ]
            const shardPops = pops.filter(({reward})=>reward==='shard')
            const ymenPops = pops.filter(({reward})=>reward==='ymen')
            const kobanPops = pops.filter(({reward})=>reward==='koban')
            const gemPops = pops.filter(({reward})=>reward==='gem')
            const orbPops = pops.filter(({reward})=>reward==='orb')
            const boosterPops = pops.filter(({reward})=>reward==='booster')
            const ticketPops = pops.filter(({reward})=>reward==='ticket')
            const giftPops = pops.filter(({reward})=>reward==='gift')
            const rewardPops = [
                {pops: shardPops, icon: `https://${cdnHost}/shards.png`, border: '#d561e6', bgSize: '28px 28px !important'},
                {pops: ymenPops, icon: `https://${cdnHost}/pictures/design/ic_topbar_soft_currency.png`, border: '#565656'},
                {pops: kobanPops, icon: `https://${cdnHost}/pictures/design/ic_topbar_hard_currency.png`, border: '#d9d9d9'},
                {pops: gemPops, icon: `https://${cdnHost}/pictures/design/gems/psychic.png`, border: '#1ddf3e'},
                {pops: orbPops, icon: `https://${cdnHost}/pachinko/o_e1.png`, border: '#0155d1'},
                {pops: boosterPops, icon: `https://${cdnHost}/pictures/items/B3.png`, border: '#ec0039'},
                {pops: ticketPops, icon: `https://${cdnHost}/pictures/design/champion_ticket.png`, border: '#e95a06'},
                {pops: giftPops, icon: `https://${cdnHost}/pictures/items/K4.png`, border: '#ffb244'},
            ]

            this.insertRule(`
                .pop_thumb_title {
                    display:none;
                }
            `)
            this.insertRule(`
                .pop_thumb>img {
                    border-radius: 0;
                    position: relative;
                    top: -27px;
                    z-index: -1;
                    float: left;
                }
            `)
            this.insertRule(`
                .pop_thumb.pop_thumb_greyed_out>img {
                    top: 0px;
                }
            `)
            this.insertRule(`
                .pop_thumb_progress_bar {
                    margin-top: 25px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_space {
                    height: 60px;
                    display: block !important;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb.pop_thumb_active[status=pending_reward] > .pop_thumb_space {
                    top: -137px;
                    position: relative;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_level {
                    top: -102px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_selected .pop_thumb_progress_bar,
                #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_progress_bar {
                    background-color: unset;
                    text-shadow: rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_selected {
                    box-shadow: 0px 0px 7px 1px;
                    color: #f90;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_expanded,
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_active,
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_greyed_out {
                    height: 99px;
                    background: linear-gradient(0deg, #00000087, transparent);
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_greyed_out {
                    height: 99px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_greyed_out .pop_thumb_title {
                    display: block;
                    margin-top: 0px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .pop_thumb_active>button {
                    position: relative;
                    top: -44px;
                }
            `)
            this.insertRule(`
                #pop .pop_list .pop_list_scrolling_area .collect_notif {
                    margin-top: -88px;
                    margin-left: 74px;
                }
            `)
            this.insertRule(`
                [rel=pop_thumb_info] {
                    position: relative;
                    top: -44px;
                }
            `)

            this.insertRule(`
                .pop_thumb>.pop_thumb_space:before {
                    content: ' ';
                    display: block;
                    position: relative;
                    height: 24px;
                    width: 24px;
                    background-size: cover;
                    top: 0px;
                    left: 0px;
                    margin-bottom: -24px;
                    background-color: #290f16;
                    border: 2px solid #290f16;
                }
            `)
            caracPops.forEach(({pops, icon}) => {
                this.insertRule(`
                    ${pops.map(({id}) => `[pop_id="${id}"]>.pop_thumb_space:before`).join(',')} {
                        background: url(${icon});
                    }
                `)
            })

            this.insertRule(`
                .pop_thumb>.pop_thumb_space:after {
                    content: ' ';
                    display: block;
                    position: relative;
                    height: 24px;
                    width: 24px;
                    background-size: cover;
                    background-position: center;
                    top: 0px;
                    left: 24px;
                    margin-bottom: -24px;
                    background-color: #290f16;
                    border: 2px solid #290f16;
                    border-bottom-right-radius: 5px;
                }
            `)
            rewardPops.forEach(({pops, icon, border, bgSize}) => {
                this.insertRule(`
                    ${pops.map(({id}) => `[pop_id="${id}"]>.pop_thumb_space:after`).join(',')} {
                        background: url(${icon});
                        ${bgSize ? `background-size: ${bgSize};`: ''}
                    }
                `)
                if (border) {
                    this.insertRule(`
                        ${pops.map(({id}) => `#pop .pop_list .pop_list_scrolling_area .pop_thumb[pop_id="${id}"]`).join(',')} {
                            border-color: ${border};
                            color: ${border};
                        }
                    `)
                }
            })
        }
    }

    class MonthlyCardText extends STModule {
        constructor () {
            const baseKey = 'monthlyCardText'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Fix monthly card text'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return true}

        injectCss() {
            this.insertRule(`
                #popups #no_HC .monthly_card .product-info {
                    line-height: 19px;
                }
            `)
            this.insertRule(`
                #popups #no_HC .monthly_card .product-info [cur=hard_currency]::before {
                    max-width: 5%;
                }
            `)
            this.insertRule(`
                #popups #no_HC .monthly_card .product-info [cur=energy_kiss]::before {
                    max-width: 6%;
                    height: 19px;
                }
            `)
            this.insertRule(`
                #popups #no_HC .monthly_card .product-info [cur=g_a]::before {
                    max-width: 6%;
                    height: 19px;
                }
            `)
            this.insertRule(`
                #popups #no_HC .monthly_card .product-normal-price {
                    bottom: 78px;
                }
            `)
        }
    }

    class PoVUnclutter extends STModule {
        constructor () {
            const baseKey = 'povUnclutter'
            const configSchema = {
                baseKey,
                default: true,
                label: 'PoV page clarity'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('path-of-valor')}

        injectCss() {
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-second-row .pov-central-section .pov-objective {
                    height: 3.8rem;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-second-row .pov-central-section .pov-objective p .pov_potion_icn {
                    width: 20px;
                    height: 20px;
                    background-size: 19px;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-second-row .pov-central-section .pov-next-milestone-panel {
                    margin-top: 2.3rem;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-first-row .pov-title-panel {
                    width: 14rem;
                    height: 6.3rem;
                    margin-top: -1.2rem;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-first-row .pov-title-panel h1 {
                    margin-top: 0.6rem;
                    font-size: 0.8rem;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-first-row .pov-title-panel h2 {
                    font-size: 1.4rem;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-second-row .pov-central-section .pov-tiers-section .pov-progress-bar-section {
                    margin-top: -3.4rem;
                    height: 20rem;
                    overflow-x: hidden;
                    scrollbar-width: none;
                }
            `)
            this.insertRule(`
                .pov-gradient-panel .pov-background-panel .pov-second-row .pov-central-section.no-milestone-left .pov-tiers-section>.pov-progress-bar-section {
                    height: 24rem;
                }
            `)
        }
    }

    class DailyGoalsRestyle extends STModule {
        constructor () {
            const baseKey = 'dailyGoals'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Daily Goals restyle'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            this.insertRule(`
                #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 1rem;
                    font-size: 0.75rem;
                    margin-top: 1.7rem;
                    height: 78%;
                }
            `)
            this.insertRule(`
                #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective {
                    width: auto;
                    margin-bottom: 0;
                    margin-left: 0;
                }
            `)
            this.insertRule(`
                #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective-status {
                    flex: 1;
                    margin-left: 0.9rem;
                }
            `)
            this.insertRule(`
                #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-status .objective-progress-bar {
                    width: 100%;
                    height: 1.1rem;
                }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-action {
                width: 2.5rem;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-action p {
                display: none;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-action .blue_button_L {
                padding: 0.3rem 0.75rem;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-status .objective-progress-bar>p {
                font-size: .6rem;
                width: 100%;
                left: 0;
                text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-reward>p {
                text-shadow: 1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000;
                margin-top: 0;
                font-size: 0.95rem;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-reward {
                width: 3.5rem;
                height: 2.2rem;
                flex-direction: row;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .daily-goals-objective .daily-goals-objective-reward .daily_goals_potion_icn {
                width: 28px;
                height: 28px;
                background-size: contain;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .progress-section .daily-goals-progress-bar .progress-bar-fill {
                border-radius: 5px;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .progress-section .daily-goals-rewards-container .daily-goals-reward {
                margin-top: -1rem;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part .daily-goals-objectives-container .nicescroll-rails {
                left: 984px!important;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-right-part {
                width: 23rem;
                height: 11rem;
                position: absolute;
                right: 0;
                overflow: hidden;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-right-part>img {
                position: absolute;
                top: 0.5rem;
                right: 12rem;
                height: 24.5rem;
                width: auto;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-right-part .side-girl-hider {
                display: none;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-right-part .daily-goals-timer {
                position: absolute;
                top: 5rem;
                right: 1rem;
            }
            `)
            this.insertRule(`
            #daily_goals .daily-goals-row .daily-goals-left-part {
                width: 62.5rem;
            }
            `)
        }
    }

    class DailyMissionsRestyle extends STModule {
        constructor () {
            const baseKey = 'dailyMissions'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Daily Missions restyle'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            this.insertRule(`
                #missions>div #missions_counter .missions-counter-rewards {
                    display: none;
                }
            `)
            //mission wrap
            this.insertRule(`
                #missions>div .missions_wrap {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-gap: 5px;
                    align-content: start;
                }
            `)
            //mission object
            this.insertRule(`
                #missions>div .missions_wrap .mission_object {
                    height: 104px;
                    margin-bottom: 0px;
                }
            `)
            //mission image
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_image {
                    margin-top: 15px;
                    margin-left: 2px;
                    margin-right: 0px;
                    width: 80px;
                    height: 80px;
                    border: 2px solid #fff;
                }
            `)
            //mission details
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details {
                    width: 150px;
                    padding: 4px 6px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details h1 {
                    position: absolute;
                    top: -4px;
                    left: 4px;
                    font-size: 13px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details p {
                    font-size: 9px;
                    margin-top: 12px;
                    line-height: 10px;
                }
            `)
            //mission reward
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_reward {
                    width: auto;
                    height: 50%;
                    padding-left: 0px;
                    padding-top: 4px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_reward .reward_wrap .slot {
                    margin-right: 4px;
                }
            `)
            //mission button
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button {
                    font-size: 12px;
                    height: 50%;
                    position: absolute;
                    right: 4px;
                    bottom: 4px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .duration {
                    top: 0px;
                    left: 0px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button button {
                    margin-top: 0px;
                    position: initial;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar {
                    left: 1px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar .backbar {
                    top: 10px;
                    width: 90px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar .text {
                    top: 0px;
                    letter-spacing: 0px;
                    font-size: 10px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish] {
                    padding: 3px 2px;
                    line-height: 14px;
                    width: 90px;
                    height: 32px;
                    margin-top: 20px;
                    font-size: 11px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish]>span[cur]::before {
                    width: 14px;
                    height: 14px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish]>span {
                    line-height: inherit;
                    margin-top: -2px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=claim] {
                    line-height: 10px;
                    width: 86px;
                    height: 40px;
                    margin-top: 5px;
                }
            `)
        }
    }

    const allModules = [
        new BlessingsButtonAlign(),
        new BonusFlowersOverflow(),
        new ChampGirlPower(),
        new ChampGirlOverlap(),
        new ClubTableShadow(),
        new CompactNav(),
        new EventGirlBorders(),
        new EventGirlTicks(),
        new HideGameLinks(),
        new LeagueTableCompact(),
        new LeagueTableRowStripes(),
        new LeagueTableShadow(),
        new MoveSkipButton(),
        new NewButtons(),
        new PoATicks(),
        new PoABorders(),
        new PoAGirlFade(),
        new PoPButtons(),
        new PoseAspectRatio(),
        new RemoveParticleEffects(),
        new ScriptSocials(),
        new ScriptTimerBars(),
        new SeasonsButtonBorder(),
        new ShrinkBundles(),
        new SidequestCompletionMarkers(),
        new ContestNotifs(),
        new ContestPointsWidth(),
        new LeagueChangeTeamButton(),
        new CompactPoPs(),
        new MonthlyCardText(),
        new PoVUnclutter(),
        new DailyGoalsRestyle(),
        new DailyMissionsRestyle(),
    ]

    setTimeout(() => {
        if (window.hhPlusPlusConfig) {
            allModules.forEach(module => {
                hhPlusPlusConfig.registerModule(module)
            })
            hhPlusPlusConfig.loadConfig()
            hhPlusPlusConfig.runModules()
        } else {
            // Standalone Config
            const defaultConfig = allModules.map(({configSchema: {baseKey, default: defaultValue}}) => ({[baseKey]: defaultValue})).reduce((c,k) => Object.assign(c,k), {})

            let config = {}
            const loadConfig = () => {
                const lsConfig = JSON.parse(localStorage.getItem(LS_CONFIG_NAME) || '{}')
                config = Object.assign({}, defaultConfig, lsConfig)
                saveConfig()
            }

            const saveConfig = () => {
                localStorage.setItem(LS_CONFIG_NAME, JSON.stringify(config))
            }

            loadConfig()

            const toggleConfig = (key) => {
                config[key] = !config[key]
                saveConfig()
            }

            if (currentPage.includes('home')) {
                let panelShown = false
                const togglePanel = () => {
                    const panel = $('.styleTweaksCfgPanel')
                    if (panelShown) {
                        panel.addClass('hidden')
                    } else {
                        panel.removeClass('hidden')
                    }

                    panelShown = !panelShown
                }

                const configButton = $('<div><div></div></div>').addClass('styleTweaksCfgBtn').attr('title', 'Style Tweaks').click(togglePanel)
                const configPanel = $('<div></div>').addClass('styleTweaksCfgPanel').addClass('hidden')
                allModules.forEach(({configSchema}) => {
                    const schema = configSchema
                    const key = schema.baseKey

                    const label = $(`<label><span>${schema.label}</span></label>`)
                    const input = $('<input></input>').attr('type', 'checkbox').attr('checked', config[key]).change(toggleConfig.bind(this, key))
                    label.prepend(input)
                    configPanel.append(label)
                })

                $(document).ready(() => {
                    $('#contains_all').append(configButton).append(configPanel)
                })

                sheet.insertRule(`
                    .styleTweaksCfgBtn {
                        height: 35px;
                        width: 35px;
                        background-color: black;
                        border-radius: 100%;
                        position: absolute;
                        top: 125px;
                        right: 15px;
                        cursor: pointer;
                        perspective: 1px;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgBtn::after {
                        content: ' ';
                        -webkit-mask: url('https://hh.hh-content.com/design/menu/edit.svg') 50% 50% / 50% no-repeat;
                        background-color: black;
                        height: 35px;
                        width: 35px;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgBtn>div {
                        height: 31px;
                        width: 31px;
                        background-color: white;
                        background-image:
                            radial-gradient(circle farthest-corner at 100% 50%, red 0%, transparent 40%),
                            radial-gradient(circle farthest-corner at 75% 93.30127%, magenta 0%, transparent 40%),
                            radial-gradient(circle farthest-corner at 25% 93.30127%, blue 0%, transparent 40%),
                            radial-gradient(circle farthest-corner at 0% 50%, cyan 0%, transparent 40%),
                            radial-gradient(circle farthest-corner at 25% 6.69873%, green 0%, transparent 40%),
                            radial-gradient(circle farthest-corner at 75% 6.69873%, yellow 0%, transparent 40%);
                        clip-path: polygon(98.66025% 45%, 99.39693% 46.5798%, 99.84808% 48.26352%, 100% 50%, 99.84808% 51.73648%, 99.39693% 53.4202%, 98.66025% 55%, 78.66025% 89.64102%, 77.66044% 91.06889%, 76.42788% 92.30146%, 75% 93.30127%, 73.4202% 94.03794%, 71.73648% 94.48909%, 70% 94.64102%, 30% 94.64102%, 28.26352% 94.48909%, 26.5798% 94.03794%, 25% 93.30127%, 23.57212% 92.30146%, 22.33956% 91.06889%, 21.33975% 89.64102%, 1.33975% 55%, 0.60307% 53.4202%, 0.15192% 51.73648%, 0% 50%, 0.15192% 48.26352%, 0.60307% 46.5798%, 1.33975% 45%, 21.33975% 10.35898%, 22.33956% 8.93111%, 23.57212% 7.69854%, 25% 6.69873%, 26.5798% 5.96206%, 28.26352% 5.51091%, 30% 5.35898%, 70% 5.35898%, 71.73648% 5.51091%, 73.4202% 5.96206%, 75% 6.69873%, 76.42788% 7.69854%, 77.66044% 8.93111%, 78.66025% 10.35898%);
                        margin: 2px;
                    }
                `)

                sheet.insertRule(`
                    .styleTweaksCfgPanel {
                        position: absolute;
                        width: 600px;
                        top: 125px;
                        right: 50px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        font-size: 11px;
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        grid-column-gap: 5px;
                        grid-row-gap: 5px;
                        padding: 5px;
                        z-index: 10;
                        border: 1px solid #ffb827;
                        background-color: rgba(32,3,7,.9);
                        border-radius: 3px;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgPanel label {
                        display: flex;
                        align-items: center;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgPanel label input {
                        flex: 0 0;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgPanel label span {
                        flex: 1 1;
                        margin-left: 5px;
                    }
                `)
                sheet.insertRule(`
                    .styleTweaksCfgPanel.hidden {
                        display: none;
                    }
                `)
            }

            allModules.forEach(module => {
                if (config[module.configSchema.baseKey]) {
                    module.run()
                }
            })
        }
    }, 1)
})()
